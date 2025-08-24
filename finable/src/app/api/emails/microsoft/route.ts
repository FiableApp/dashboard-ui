import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "No access token available" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const top = searchParams.get("top") || "10";
    const filter = searchParams.get("filter") || "";

    // Build the Microsoft Graph API URL
    let graphUrl = `https://graph.microsoft.com/v1.0/me/messages?$top=${top}&$select=id,subject,from,toRecipients,receivedDateTime,bodyPreview,isRead`;
    
    if (filter) {
      graphUrl += `&$filter=${encodeURIComponent(filter)}`;
    }

    // Fetch emails from Microsoft Graph API
    const graphResponse = await fetch(graphUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!graphResponse.ok) {
      throw new Error(`Microsoft Graph API error: ${graphResponse.statusText}`);
    }

    const emailsData = await graphResponse.json();

    // Process and format the emails
    const emails = emailsData.value?.map((email: any) => ({
      id: email.id,
      subject: email.subject,
      from: email.from?.emailAddress?.address,
      fromName: email.from?.emailAddress?.name,
      toRecipients: email.toRecipients?.map((recipient: any) => ({
        email: recipient.emailAddress?.address,
        name: recipient.emailAddress?.name,
      })),
      receivedDateTime: email.receivedDateTime,
      bodyPreview: email.bodyPreview,
      isRead: email.isRead,
    })) || [];

    return NextResponse.json({
      success: true,
      emails,
      total: emailsData["@odata.count"] || emails.length,
    });

  } catch (error) {
    console.error("Error fetching Microsoft emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
