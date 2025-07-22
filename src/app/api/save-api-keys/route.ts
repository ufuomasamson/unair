import { NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwriteClient';
import { ID, Query } from 'appwrite';

export async function POST(request: Request) {
  try {
    const { keys } = await request.json();
    
    console.log('Saving API keys:', keys);
    
    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid keys data'
      }, { status: 400 });
    }

    const results = [];
    
    for (const keyData of keys) {
      console.log('Saving key:', keyData.type);
      
      try {
        // Check if the payment gateway already exists
        const existingGateways = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PAYMENT_GATEWAYS,
          [
            Query.equal('name', keyData.name),
            Query.equal('type', keyData.type)
          ]
        );
        
        let data;
        
        if (existingGateways.documents.length > 0) {
          // Update existing gateway
          data = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.PAYMENT_GATEWAYS,
            existingGateways.documents[0].$id,
            keyData
          );
        } else {
          // Create new gateway
          data = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.PAYMENT_GATEWAYS,
            ID.unique(),
            keyData
          );
        }
      
        // Success case
        console.log('Successfully saved key:', keyData.type);
        results.push({
          type: keyData.type,
          success: true,
          data
        });
      } catch (error: any) {
        // Error case
        console.error('Error saving key:', keyData.type, error);
        results.push({
          type: keyData.type,
          success: false,
          error: error.message || 'Failed to save key'
        });
      }
    }

    const allSuccessful = results.every(result => result.success);
    
    return NextResponse.json({
      success: allSuccessful,
      results,
      message: allSuccessful ? 'All API keys saved successfully' : 'Some keys failed to save'
    });
    
  } catch (error: any) {
    console.error('API save error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 