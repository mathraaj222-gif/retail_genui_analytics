from app.services.ai.orchestrator import orchestrator

class AutonomousAnalyticsAgent:
    """
    High-Intelligence AI Agent.
    Orchestrates the multi-agent workflow.
    """
    def process_request(self, user_prompt: str):
        return orchestrator.process_request(user_prompt)

agent = AutonomousAnalyticsAgent()


