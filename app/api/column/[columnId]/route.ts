import { PrismaClient } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest, { params }: Params) => {
  console.log(params.columnId)
  const deletedColumn = await prisma.column.findUnique({
    where: {
      id: params.columnId
    }
  });

  return NextResponse.json(deletedColumn);
};


export const DELETE = async (req: NextRequest, { params }: Params) => {
  console.log(params.columnId)
  const deletedColumn = await prisma.column.delete({
    where: {
      id: params.columnId
    }
  });

  return NextResponse.json(deletedColumn);
};