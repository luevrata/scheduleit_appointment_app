import { CSSObject } from "@emotion/react";

export const textButtonStyle: CSSObject = {
  color: "var(--color-blue1)",
  height: "50px",
  borderRadius: "32px",
};

export const outlinedButtonStyle: CSSObject = {
  border: "2px solid var(--color-blue1)",
  borderRadius: "32px",
  color: "var(--color-blue1)",
  height: "50px",
  "&:hover": {
    border: "2px solid var(--color-blue1)",
    borderRadius: "3px",
  },
};

export const filledButtonStyle: CSSObject = {
  backgroundColor: "var(--color-blue1)",
  borderRadius: "32px",
  height: "50px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "var(--color-blue1)",
    borderRadius: "32px",
    boxShadow: "none",
  },
};

export const textFieldStyle: CSSObject = {
  backgroundColor: "white",
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderWidth: 3,
    borderColor: "var(--color-blue1)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-blue1)",
  },
  "& .MuiInputLabel-root.Mui-focused ": { color: "var(--color-blue1)" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-blue1)",
  },
};
