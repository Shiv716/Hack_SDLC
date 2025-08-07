from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import re
import hashlib
import json
import asyncio

app = FastAPI(title="AI Release Gate API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class CodeAnalysisRequest(BaseModel):
    project_name: str
    environment: str
    commit_hash: str
    code_changes: str

class AnalysisResult(BaseModel):
    risk_score: int
    test_coverage: int
    complexity_score: int
    security_score: int
    approved: bool
    issues: List[str]
    recommendations: List[str]

class DeploymentRequest(BaseModel):
    project_name: str
    environment: str
    commit_hash: str

class DeploymentStatus(BaseModel):
    status: str
    timestamp: datetime
    environment: str
    project: str
    commit: str

# In-memory storage (use database in production)
deployment_history: List[Dict[str, Any]] = []
analysis_cache: Dict[str, AnalysisResult] = {}

class AICodeAnalyzer:
    """AI-powered code analysis engine"""
    
    @staticmethod
    def analyze_security_patterns(code: str) -> Dict[str, bool]:
        """Analyze code for security patterns"""
        patterns = {
            'has_validation': bool(re.search(r'if\s*\(\s*!|\bvalidate\b|\bcheck\b', code, re.IGNORECASE)),
            'has_error_handling': bool(re.search(r'\btry\b|\bcatch\b|\berror\b|\bexcept\b', code, re.IGNORECASE)),
            'has_auth': bool(re.search(r'\bauth\b|\btoken\b|\bjwt\b|\bbearer\b', code, re.IGNORECASE)),
            'has_sql_injection_risk': bool(re.search(r'query\s*\+|execute\s*\(.*\+', code)),
            'has_hardcoded_secrets': bool(re.search(r'password\s*=|api_key\s*=|secret\s*=', code, re.IGNORECASE)),
            'is_payment_code': bool(re.search(r'\bpayment\b|\bcharge\b|\bamount\b|\btransaction\b', code, re.IGNORECASE)),
            'has_database_ops': bool(re.search(r'\bdb\.\b|\bquery\b|\bfindOne\b|\binsert\b|\bupdate\b', code, re.IGNORECASE)),
        }
        return patterns
    
    @staticmethod
    def calculate_complexity(code: str) -> int:
        """Calculate code complexity based on various metrics"""
        lines = len(code.split('\n'))
        functions = len(re.findall(r'\bdef\b|\bfunction\b|\basync\s+def\b', code))
        conditionals = len(re.findall(r'\bif\b|\belse\b|\belif\b|\bswitch\b', code))
        loops = len(re.findall(r'\bfor\b|\bwhile\b|\bforeach\b', code))
        
        complexity = min(10, (lines // 20) + (functions * 2) + conditionals + loops)
        return max(1, complexity)
    
    @staticmethod
    def generate_recommendations(patterns: Dict[str, bool], risk_score: int, approved: bool) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if not patterns['has_validation']:
            recommendations.append("Add comprehensive input validation to prevent malicious data")
        
        if not patterns['has_error_handling']:
            recommendations.append("Implement proper error handling and logging")
        
        if patterns['has_sql_injection_risk']:
            recommendations.append("Use parameterized queries to prevent SQL injection")
        
        if patterns['has_hardcoded_secrets']:
            recommendations.append("Move secrets to environment variables or secure vault")
        
        if patterns['is_payment_code'] and not patterns['has_auth']:
            recommendations.append("Add authentication middleware for payment endpoints")
        
        if approved:
            recommendations.append("Consider adding integration tests for critical paths")
            recommendations.append("Monitor error rates and performance post-deployment")
        else:
            recommendations.append("Address security issues before attempting deployment")
        
        return recommendations
    
    @staticmethod
    def generate_issues(patterns: Dict[str, bool], risk_score: int) -> List[str]:
        """Generate list of detected issues"""
        issues = []
        
        if not patterns['has_validation']:
            issues.append("Missing input validation - potential security vulnerability")
        
        if not patterns['has_error_handling']:
            issues.append("Insufficient error handling - may cause application crashes")
        
        if patterns['has_sql_injection_risk']:
            issues.append("Potential SQL injection vulnerability detected")
        
        if patterns['has_hardcoded_secrets']:
            issues.append("Hardcoded secrets found - security risk")
        
        if patterns['is_payment_code'] and not patterns['has_auth']:
            issues.append("Payment endpoint lacks proper authentication")
        
        if risk_score > 7:
            issues.append("High complexity code - difficult to maintain and test")
        
        return issues

class DeploymentEngine:
    """Handles deployment operations"""
    
    @staticmethod
    async def deploy_to_environment(project: str, environment: str, commit: str) -> Dict[str, Any]:
        """Simulate deployment process"""
        deployment_steps = [
            "Building Docker image...",
            "Running pre-deployment tests...",
            "Uploading to container registry...",
            "Deploying to Kubernetes cluster...",
            "Running health checks...",
            "Configuring load balancer...",
            "Deployment completed successfully!"
        ]
        
        # Simulate deployment time
        for step in deployment_steps:
            await asyncio.sleep(0.5)  # Simulate work
        
        return {
            "status": "success",
            "timestamp": datetime.now(),
            "steps_completed": len(deployment_steps),
            "environment": environment,
            "project": project,
            "commit": commit
        }
    
    @staticmethod
    async def rollback_deployment(project: str, environment: str) -> Dict[str, Any]:
        """Simulate rollback process"""
        rollback_steps = [
            "Initiating rollback procedure...",
            "Finding previous stable version...",
            "Rolling back to previous version...",
            "Updating service configuration...",
            "Rollback completed successfully"
        ]
        
        for step in rollback_steps:
            await asyncio.sleep(0.3)
        
        return {
            "status": "rolled_back",
            "timestamp": datetime.now(),
            "steps_completed": len(rollback_steps)
        }

# API Endpoints
@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_code(request: CodeAnalysisRequest):
    """Analyze code changes and determine deployment risk"""
    
    # Create cache key
    cache_key = hashlib.md5(
        f"{request.code_changes}{request.environment}".encode()
    ).hexdigest()
    
    # Check cache
    if cache_key in analysis_cache:
        return analysis_cache[cache_key]
    
    # Simulate AI processing time
    await asyncio.sleep(2)
    
    analyzer = AICodeAnalyzer()
    patterns = analyzer.analyze_security_patterns(request.code_changes)
    
    # Calculate risk score
    risk_score = 3  # Base risk
    
    # Environment risk
    if request.environment == "production":
        risk_score += 2
    elif request.environment == "staging":
        risk_score += 1
    
    # Pattern-based risk adjustments
    if patterns['is_payment_code']:
        risk_score += 1
    if not patterns['has_validation']:
        risk_score += 2
    if not patterns['has_error_handling']:
        risk_score += 1
    if patterns['has_sql_injection_risk']:
        risk_score += 3
    if patterns['has_hardcoded_secrets']:
        risk_score += 2
    if not patterns['has_auth'] and patterns['is_payment_code']:
        risk_score += 2
    if patterns['has_database_ops']:
        risk_score += 1
    
    # Calculate other metrics
    complexity_score = analyzer.calculate_complexity(request.code_changes)
    test_coverage = max(60, 95 - risk_score * 5)
    security_score = 10 - min(4, len([p for p in patterns.values() if not p]))
    
    # Determine approval
    approved = risk_score <= 6 and (request.environment != "production" or risk_score <= 5)
    
    # Generate issues and recommendations
    issues = analyzer.generate_issues(patterns, risk_score)
    recommendations = analyzer.generate_recommendations(patterns, risk_score, approved)
    
    result = AnalysisResult(
        risk_score=min(10, risk_score),
        test_coverage=test_coverage,
        complexity_score=min(10, complexity_score),
        security_score=max(1, security_score),
        approved=approved,
        issues=issues,
        recommendations=recommendations
    )
    
    # Cache result
    analysis_cache[cache_key] = result
    
    return result

@app.post("/api/deploy")
async def deploy_application(request: DeploymentRequest):
    """Deploy application to specified environment"""
    
    try:
        deployment_engine = DeploymentEngine()
        result = await deployment_engine.deploy_to_environment(
            request.project_name,
            request.environment,
            request.commit_hash
        )
        
        # Store in history
        deployment_history.append({
            "timestamp": result["timestamp"].isoformat(),
            "project": request.project_name,
            "environment": request.environment,
            "commit": request.commit_hash,
            "status": "deployed",
            "steps_completed": result["steps_completed"]
        })
        
        return {"message": "Deployment successful", "details": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")

@app.post("/api/rollback")
async def rollback_application(request: DeploymentRequest):
    """Rollback application to previous version"""
    
    try:
        deployment_engine = DeploymentEngine()
        result = await deployment_engine.rollback_deployment(
            request.project_name,
            request.environment
        )
        
        # Store in history
        deployment_history.append({
            "timestamp": result["timestamp"].isoformat(),
            "project": request.project_name,
            "environment": request.environment,
            "commit": "previous",
            "status": "rolled_back",
            "steps_completed": result["steps_completed"]
        })
        
        return {"message": "Rollback successful", "details": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rollback failed: {str(e)}")

@app.get("/api/deployment-history")
async def get_deployment_history():
    """Get deployment history"""
    return {"deployments": deployment_history}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "AI Release Gate API"
    }

@app.get("/api/metrics")
async def get_system_metrics():
    """Get system metrics"""
    total_deployments = len(deployment_history)
    successful_deployments = len([d for d in deployment_history if d["status"] == "deployed"])
    rollbacks = len([d for d in deployment_history if d["status"] == "rolled_back"])
    
    return {
        "total_analyses": len(analysis_cache),
        "total_deployments": total_deployments,
        "successful_deployments": successful_deployments,
        "rollbacks": rollbacks,
        "success_rate": (successful_deployments / total_deployments * 100) if total_deployments > 0 else 0,
        "cache_size": len(analysis_cache)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)