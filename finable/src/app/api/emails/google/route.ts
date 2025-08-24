import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "No access token available" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get("maxResults") || "10";
    const query = searchParams.get("q") || "";

    // Fetch emails from Gmail API
    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!gmailResponse.ok) {
      throw new Error(`Gmail API error: ${gmailResponse.statusText}`);
    }

    const messages = await gmailResponse.json();

    // Fetch full email details for each message
    const emailsWithDetails = await Promise.all(
      messages.messages?.slice(0, 5).map(async (message: any) => {
        const emailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          return {
            id: message.id,
            threadId: emailData.threadId,
            labelIds: emailData.labelIds,
            snippet: emailData.snippet,
            headers: emailData.payload?.headers,
            internalDate: emailData.internalDate,
          };
        }
        return null;
      }) || []
    );

    const validEmails = emailsWithDetails.filter(Boolean);

    return NextResponse.json({
      success: true,
      emails: validEmails,
      total: messages.resultSizeEstimate,
    });

  } catch (error) {
    console.error("Error fetching Gmail emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
