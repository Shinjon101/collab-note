import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";

export const FollowPointer = ({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) => {
  const color = stringToColor(info.email || "1");

  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{
        top: y,
        left: x,
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      {/* Cursor pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transform -translate-x-3 -translate-y-2 rotate-12"
      >
        <path
          d="M5.5 3L19 12L12.5 13.5L8.5 19L5.5 3Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>

      {/* Name label */}
      <motion.div
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className="absolute top-5 left-2 px-2 py-1 bg-white text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full shadow-md border"
        style={{
          borderColor: color,
        }}
      >
        {info.name || info.email || "Anonymous"}
      </motion.div>
    </motion.div>
  );
};
