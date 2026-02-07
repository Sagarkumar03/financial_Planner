export interface Calculator<Input, Output, Context = unknown> {
  calculate(input: Input, context?: Context): Output;
}

// Ensure this file is treated as a module
export {};
