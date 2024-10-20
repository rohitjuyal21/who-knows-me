import dbConnect from "@/lib/dbConnect";
import { Quiz } from "@/models/Quiz";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const quizId = params.quizId;
  try {
    await dbConnect();

    const quiz = await Quiz.findOne({ quizId });

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 });
    }

    const quizCreator = await User.findById(quiz.creator);

    return Response.json({
      quizCreator,
      questions: quiz.questions,
    });
  } catch (error) {
    return Response.json(
      { message: "Error fetching quiz", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const quizId = params.quizId;
  try {
    await dbConnect();
    await Quiz.findOneAndDelete({ quizId });
    cookies().delete("createdQuiz");
    return Response.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.log("Error deleting quiz", error);
  }
}
