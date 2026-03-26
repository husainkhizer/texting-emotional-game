import { forwardRef } from "react";
import type { ConversationEntry } from "../store/gameStore";

interface Props {
  conversation: ConversationEntry[];
  archetype: string;
}

export const ConversationCard = forwardRef<HTMLDivElement, Props>(
  ({ conversation, archetype }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "375px",
          background: "#000000",
          padding: "32px 20px 28px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Last Message
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {conversation.map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: entry.role === "you" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: entry.role === "you" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background:
                    entry.role === "you" ? "#3b5bdb" : "#1c1c1e",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 300,
                  lineHeight: "1.4",
                }}
              >
                {entry.text}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "16px",
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginBottom: "6px",
            }}
          >
            {archetype}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.18)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            lastmessage.game
          </div>
        </div>
      </div>
    );
  }
);

ConversationCard.displayName = "ConversationCard";
