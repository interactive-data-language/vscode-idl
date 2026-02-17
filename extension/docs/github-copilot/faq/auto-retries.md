# Auto-Retries

## Key Takeaways

GitHub Copilot automatically retries when errors occur, allowing it to work through issues intelligently. You can control this behavior with simple instructions.

**Default Behavior:** Automatic retries enabled (recommended for most scenarios)

**Disable When:** You need strict, step-by-step execution without improvisation

## How It Works

GitHub Copilot's auto-retry feature represents one of its strongest capabilities—the ability to adapt and resolve issues on the fly. When an error occurs, the LLM analyzes the problem and attempts different approaches until it finds a solution.

This behavior works well for exploratory tasks, complex workflows, and situations where you want the LLM to handle unexpected issues independently.

## Controlling Auto-Retries

When you need strict control over execution, simply include instructions in your request:

**Example:** "If you encounter an error, stop processing and let me know."

This approach is valuable when you have specific steps that must be followed exactly, or when you want to review each decision the LLM makes.
