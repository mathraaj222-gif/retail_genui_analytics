import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from app.core.config import settings

load_dotenv()

class LLMClient:
    def __init__(self):
        self.groq_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY")
        
        # Initialize clients
        if self.groq_key:
            self.groq_client = OpenAI(api_key=self.groq_key, base_url="https://api.groq.com/openai/v1")
            print("LLM Core: Groq initialized via OpenAI SDK.")
        else:
            self.groq_client = None

    def generate_json(self, prompt, system_prompt="You are a senior business intelligence agent."):
        # 1. Try Groq
        if getattr(self, "groq_client", None):
            try:
                response = self.groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": f"{system_prompt} Respond ONLY with valid JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7
                )
                return self._safe_json_load(response.choices[0].message.content)
            except Exception as e:
                print(f"Groq Generation Error: {e}")

        # 2. Fallback to Mock
        print(f"CRITICAL: Groq AI failed. Falling back to Mock Data.")
        return self._mock_response(prompt)

    def _safe_json_load(self, text):
        """Attempts to parse JSON, fixing common LLM errors like markdown blocks and unescaped newlines."""
        if not text:
            return {}
            
        try:
            # 1. Basic Cleaning
            clean_text = text.strip()
            
            # Remove markdown code blocks if present
            if "```json" in clean_text:
                clean_text = clean_text.split("```json")[1].split("```")[0].strip()
            elif "```" in clean_text:
                clean_text = clean_text.split("```")[1].split("```")[0].strip()
            
            # 2. Attempt direct parse
            return json.loads(clean_text)
        except Exception:
            try:
                # 3. Advanced Repair: Handle unescaped newlines inside strings
                # This is a common Ollama / Llama3 issue
                repaired = ""
                in_string = False
                escape = False
                
                for char in clean_text:
                    if char == '"' and not escape:
                        in_string = not in_string
                    
                    if in_string:
                        if char == '\n':
                            repaired += "\\n"
                        elif char == '\t':
                            repaired += "\\t"
                        elif char == '\r':
                            repaired += "\\r"
                        else:
                            repaired += char
                    else:
                        repaired += char
                        
                    if char == '\\':
                        escape = not escape
                    else:
                        escape = False
                
                return json.loads(repaired)
            except Exception as e:
                print(f"JSON Parse Error (Repaired): {e}. Raw sample: {text[:100]}...")
                return {}

    def _mock_response(self, prompt):
        """
        Premium Mock Engine: Returns real GenUI schemas for visual demonstration.
        """
        p = prompt.lower()
        
        # SQL AGENT MOCK
        if "sql" in p or "query" in p or "postgres" in p:
            return {
                "sql": "SELECT p.product_name, SUM(f.quantity_sold_aft_promo) as sales FROM fact_events f JOIN dim_products p ON f.product_code = p.product_code GROUP BY p.product_name ORDER BY sales DESC LIMIT 8",
                "explanation": "Mock SQL generated due to LLM failure.",
                "complexity": "low"
            }
            
        # VIZ AGENT MOCK
        if "chart" in p or "viz" in p or "select the best" in p:
            return {
                "chart_type": "pie" if "pie" in p else "bar",
                "title": "Data Distribution (Mocked)",
                "xKey": "product_name",
                "yKey": "sales",
                "explanation": "Using mock chart selection logic."
            }
            
        # NLU AGENT MOCK
        if "intent" in p or "extract" in p:
            return {
                "corrected_query": "Top products by sales",
                "intent": "descriptive",
                "entities": {"metrics": ["sales"]},
                "mapped_columns": []
            }
            
        # INSIGHT AGENT MOCK
        return {
            "executive_summary": "Retail performance remains strong despite temporary intelligence core downtime.",
            "insights": [
                {"title": "Intelligence Offline", "description": "System is currently running on mock protocols.", "severity": "medium"}
            ],
            "recommendations": [
                {"action": "Check LLM Connection", "impact": "Restores full autonomous reasoning.", "urgency": "high"}
            ],
            "plain_english": "I'm currently unable to process your specific question because my AI core is offline. Here is a generic view of your data performance."
        }

client = LLMClient()
