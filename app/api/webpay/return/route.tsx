import { NextResponse } from "next/server";
import {
  Environment,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
  WebpayPlus,
} from "transbank-sdk";

interface ReturnRequest {
  token_ws: string;
}

class PaymentError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

class ValidationError extends PaymentError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export async function POST(req: Request) {
  try {
    const body: ReturnRequest = await req.json();
    const { token_ws } = body;

    if (!token_ws) {
      throw new ValidationError("Token is required");
    }

    // Get environment configuration
    const isProduction = process.env.TRANSBANK_ENVIRONMENT === "Production";
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || 
      IntegrationCommerceCodes.WEBPAY_PLUS;
    const apiKey = process.env.TRANSBANK_API_KEY || 
      IntegrationApiKeys.WEBPAY;

    // Commit the transaction
    const tx = new WebpayPlus.Transaction(
      new Options(
        commerceCode,
        apiKey,
        isProduction ? Environment.Production : Environment.Integration
      )
    );

    const commitResponse = await tx.commit(token_ws);

    // Check if payment was successful
    if (commitResponse.response_code === 0) {
      return NextResponse.json({
        success: true,
        data: commitResponse,
        message: "Payment completed successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        data: commitResponse,
        message: `Payment failed with code: ${commitResponse.response_code}`,
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Webpay commit error:", error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { 
          error: error.name,
          message: error.message 
        },
        { status: error.statusCode }
      );
    }
    
    // Handle Transbank SDK errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "TransactionError",
          message: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "InternalServerError",
        message: "Failed to process payment" 
      },
      { status: 500 }
    );
  }
}