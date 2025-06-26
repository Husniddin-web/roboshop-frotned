import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function UsefulContent() {
  const { t } = useTranslation();

  return (
    <section
      className="py-8"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(250, 204, 21, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(250, 204, 21, 0.02) 0%, transparent 50%)
          `,
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <div className="container relative z-10">
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{
            color: "#facc15",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {t("useful.content")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* First card */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              border: "1px solid rgba(250, 204, 21, 0.2)",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "200px",
                overflow: "hidden",
              }}
            >
              <Image
                src="/ai-curcuit.jpeg"
                alt="AI Circuit Board"
                fill
                className="object-cover"
                style={{
                  filter: "brightness(0.7) contrast(1.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.8) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(circle at 30% 40%, rgba(250, 204, 21, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(250, 204, 21, 0.08) 0%, transparent 50%)
                  `,
                  animation: "pulse 4s ease-in-out infinite",
                }}
              />
            </div>

            <div className="p-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{
                  color: "#facc15",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t("arduino.what")}
              </h3>
              <p
                style={{
                  color: "#d4d4aa",
                  lineHeight: "1.6",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  fontSize: "0.9rem",
                }}
              >
                {t("arduino.what.text")}
              </p>
            </div>
          </div>

          {/* Second card */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              border: "1px solid rgba(250, 204, 21, 0.2)",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "200px",
                overflow: "hidden",
              }}
            >
              <Image
                src="/retro-computer.jpg"
                alt="Retro Computer"
                fill
                className="object-cover"
                style={{
                  filter: "brightness(0.8) contrast(1.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.8) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(circle at 60% 30%, rgba(250, 204, 21, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 70%, rgba(250, 204, 21, 0.08) 0%, transparent 50%)
                  `,
                  animation: "pulse 4s ease-in-out infinite reverse",
                }}
              />
            </div>

            <div className="p-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{
                  color: "#facc15",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t("arduino.why")}
              </h3>
              <p
                style={{
                  color: "#d4d4aa",
                  lineHeight: "1.6",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  fontSize: "0.9rem",
                }}
              >
                {t("arduino.why.text")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
}
