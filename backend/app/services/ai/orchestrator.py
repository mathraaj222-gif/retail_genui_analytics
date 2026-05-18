import time
from app.services.ai.agents.nlu_agent import NLUAgent
from app.services.ai.agents.sql_agent import SQLAgent
from app.services.ai.agents.viz_agent import VizAgent
from app.services.ai.agents.insight_agent import InsightAgent
from app.services.ui_schema.schema_builder import build_genui_response

class AutonomousAnalyticsOrchestrator:
    def __init__(self):
        self.nlu = NLUAgent()
        self.sql_engine = SQLAgent()
        self.viz_engine = VizAgent()
        self.insight_engine = InsightAgent()

    def process_request(self, user_prompt: str):
        start_time = time.time()
        print(f"\n[ORCHESTRATOR] Starting request: {user_prompt}")
        
        # 1. NLU & Schema Mapping
        print(" -> Step 1: NLU Processing...")
        nlu_result = self.nlu.process(user_prompt)
        corrected_query = nlu_result.get("corrected_query", user_prompt)
        
        # 2. SQL Generation & Execution (with Self-Healing)
        print(" -> Step 2: SQL Generation & Execution...")
        sql_gen_result = self.sql_engine.generate_sql(nlu_result)
        execution_result = self.sql_engine.execute_and_validate(
            sql=sql_gen_result.get("sql"),
            nlu_data=nlu_result
        )
        
        if execution_result["status"] == "error":
            return {
                "error": True,
                "message": f"Analytics engine failed to process the data: {execution_result['message']}",
                "agent_note": "SQL execution failed after multiple retries."
            }
        
        data = execution_result["data"]
        executed_sql = execution_result["sql"]
        
        # 3. Intelligent Visualization Selection
        print(" -> Step 3: Visualization Selection...")
        viz_result = self.viz_engine.select_chart(corrected_query, data, nlu_result)
        
        # 4. Insight Generation
        print(" -> Step 4: Insight & Recommendation Generation...")
        insight_result = self.insight_engine.generate_insights(
            query=corrected_query,
            data=data,
            nlu_data=nlu_result,
            viz_data=viz_result
        )
        
        # 5. Build GenUI Response
        print(" -> Step 5: Finalizing UI Schema...")
        response = build_genui_response(
            schema_type=viz_result.get("chart_type", "bar"),
            data=data,
            title=viz_result.get("title", "Data Analysis"),
            insights=insight_result.get("insights", []),
            xKey=viz_result.get("xKey"),
            yKey=viz_result.get("yKey")
        )
        
        # Enrich response with executive data
        response.update({
            "executive_summary": insight_result.get("executive_summary"),
            "recommendations": insight_result.get("recommendations"),
            "plain_english": insight_result.get("plain_english"),
            "viz_explanation": viz_result.get("explanation"),
            "sql": executed_sql,
            "latency": round(time.time() - start_time, 2),
            "agent_note": "Multi-agent autonomous reasoning complete."
        })
        
        return response

orchestrator = AutonomousAnalyticsOrchestrator()
