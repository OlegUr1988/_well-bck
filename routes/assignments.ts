import express from "express";
import { prisma } from "../prisma/client";
import { assignmentSchema, updateAssignmentSchema } from "../schemas";

const router = express.Router();

interface AssignmentQuery {
  partParameterId: number;
  PHDTagId: number;
}

router.get("/:partParameterId", async (req, res) => {
  const { partParameterId } = req.params;

  const assignments = await prisma.assignment.findMany({
    where: {
      partParameterId: parseInt(partParameterId),
    },
    include: { PHDTag: true },
  });

  res.send(assignments);
});

router.post("/", async (req, res) => {
  const validation = assignmentSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { partParameterId, PHDTagId } = req.body as AssignmentQuery;

  const existingAssignment = await prisma.assignment.findUnique({
    where: {
      partParameterId_PHDTagId: { partParameterId, PHDTagId },
    },
  });

  if (existingAssignment)
    return res
      .status(400)
      .send({ message: "The assignment is already exists" });

  const newAssignment = await prisma.assignment.create({
    data: {
      partParameterId,
      PHDTagId,
    },
  });

  res.status(201).send(newAssignment);
});

router.put("/:paramId/:tagId", async (req, res) => {
  const { paramId, tagId } = req.params;
  const parameterId = parseInt(paramId);
  const tag = parseInt(tagId);

  const assignment = await prisma.assignment.findUnique({
    where: {
      partParameterId_PHDTagId: {
        partParameterId: parameterId,
        PHDTagId: tag,
      },
    },
  });

  if (!assignment)
    return res
      .status(404)
      .send("The assignment with the given parameters was not found");

  const validation = updateAssignmentSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).send(validation.error.format());

  const { PHDTagId } = req.body as AssignmentQuery;

  const existingAssignment = await prisma.assignment.findUnique({
    where: {
      partParameterId_PHDTagId: {
        partParameterId: parameterId,
        PHDTagId,
      },
    },
  });

  if (existingAssignment)
    return res
      .status(400)
      .send("The assignment with the given tag already exists");

  const updatedAssignment = await prisma.assignment.update({
    where: {
      partParameterId_PHDTagId: {
        partParameterId: parameterId,
        PHDTagId: tag,
      },
    },
    data: {
      PHDTagId,
    },
  });

  res.send(updatedAssignment);
});

router.delete("/:paramId/:tagId", async (req, res) => {
  const { paramId, tagId } = req.params;
  const parameterId = parseInt(paramId);
  const tag = parseInt(tagId);

  const assignment = await prisma.assignment.findUnique({
    where: {
      partParameterId_PHDTagId: {
        partParameterId: parameterId,
        PHDTagId: tag,
      },
    },
  });

  if (!assignment)
    return res
      .status(404)
      .send("The assignment with the given parameters was not found");

  const deletedAssignment = await prisma.assignment.delete({
    where: {
      partParameterId_PHDTagId: {
        partParameterId: parameterId,
        PHDTagId: tag,
      },
    },
  });

  res.send(deletedAssignment);
});

export default router;
