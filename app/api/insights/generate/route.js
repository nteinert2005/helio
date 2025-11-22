import { NextRequest, NextResponse } from "next/server";
import { generateInsights } from "@/lib/insightEngine";

export async function POST(req, res){
  // const body = await req.json();


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

  return res.json({
    success: true, 
    insights: 100
  })
}