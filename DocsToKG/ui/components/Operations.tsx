import React from "react";
import { useTheme } from "./themes";

const Operations: React.FC = () => {
  const { themeClasses } = useTheme();

  return (
    <div className={`rounded-lg p-6 border w-full max-w-2xl mx-auto ${themeClasses.card}`}>
      <p className={`text-center ${themeClasses.text.secondary}`}>
        This panel represents the content area for{" "}
        <span className={themeClasses.text.accent + " font-medium"}>Operations</span>.
      </p>
    </div>
  );
};

export default Operations;