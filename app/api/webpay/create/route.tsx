import { NextResponse } from "next/server";
import {
  Environment,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
  WebpayPlus,
} from "transbank-sdk";

interface PaymentRequest {
  buyOrder: string;
  sessionId: string;
  amount: number;
  returnUrl: string;
  userId?: string;
  cartItems?: Array<{
    id: number;
    nombre: string;
    precio: string;
    tipo: string;
  }>;
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
    const body: PaymentRequest = await req.json();
    const { buyOrder, sessionId, amount, returnUrl } = body;

    // Validate required fields
    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      throw new ValidationError("Missing required parameters");
    }

    // Validate amount is positive
    if (amount <= 0) {
      throw new ValidationError("Amount must be greater than 0");
    }

    // Validate amount is within reasonable limits
    if (amount > 99999999) {
      throw new ValidationError("Amount exceeds maximum allowed");
    }

    // Get environment configuration
    const isProduction = process.env.TRANSBANK_ENVIRONMENT === "Production";
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || 
      IntegrationCommerceCodes.WEBPAY_PLUS;
    const apiKey = process.env.TRANSBANK_API_KEY || 
      IntegrationApiKeys.WEBPAY;

    // Create transaction
    const tx = new WebpayPlus.Transaction(
      new Options(
        commerceCode,
        apiKey,
        isProduction ? Environment.Production : Environment.Integration
      )
    );

    const createResponse = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    return NextResponse.json({
      success: true,
      token: createResponse.token,
      url: createResponse.url,
    });
  } catch (error) {
    console.error("Webpay create error:", error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { 
          error: error.name,
          message: error.message 
        },
        { status: error.statusCode }
      );
    }
    
    // Handle Transbank SDK errors or network errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "TransactionError",
          message: error.message 
        },
        { status: 500 }
      );
    }

    // Unknown error
    return NextResponse.json(
      { 
        error: "InternalServerError",
        message: "Failed to create payment" 
      },
      { status: 500 }
    );
  }
}