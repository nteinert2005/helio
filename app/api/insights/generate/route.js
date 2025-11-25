import { NextRequest, NextResponse } from "next/server";
import { generateInsights } from "@/lib/insightEngine";

import userData from "@/lib/insightEngine/testUserData";

export async function POST(request){
  try {
    const body = await request.json();
    const dailyLogId = body.daily_log_id;

    if (!dailyLogId) {
      return NextResponse.json(
        { message: 'daily_log_id is required' },
        { status: 400 }
      );
    }

    // For testing, you can use userData, but in production use the actual data
    const inputData = body.input_data || userData;

    const insights = await generateInsights(inputData, dailyLogId);

    return NextResponse.json(
      {
        message: 'Insight generated successfully',
        insights
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error generating insights:', err);
    return NextResponse.json(
      {
        message: `Error: ${err.message}`,
      },
      { status: 500 }
    );
  }


  // try {
  //   const insights = await generateInsights(body);
  //   return res.json({
  //     success: true, 
  //     insights
  //   })
  // } catch (err) {
  //   console.log(err);
  //   return res.json({
  //     success: false, 
  //     error: "Failed to generate insights"
  //   })
  // }
}