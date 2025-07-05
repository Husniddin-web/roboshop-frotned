import { motion } from "framer-motion";

export default function LoadingOrders() {
  return (
    <div className="p-12 text-center">
      <motion.div
        className="mx-auto"
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(255, 255, 255, 0.2)",
          borderTop: "3px solid #ffffff",
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <p className="mt-4 text-neutral-400 font-mono">Loading orders...</p>
    </div>
  );
}
