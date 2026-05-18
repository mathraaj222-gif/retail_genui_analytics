from app.services.ai.llm_client import client

class BaseAgent:
    def __init__(self, role: str, goal: str):
        self.role = role
        self.goal = goal
        self.client = client

    def call_llm(self, prompt: str, system_prompt: str = None):
        if system_prompt is None:
            system_prompt = f"You are a {self.role}. Your goal is: {self.goal}"
        return self.client.generate_json(prompt, system_prompt)
