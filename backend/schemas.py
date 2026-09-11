from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "E-Mortem API"

class DeviceBase(BaseModel):
    device_type: str = "Smartphone"
    brand: str
    model: str
    purchase_date: Optional[str] = None
    purchase_price: float = 0.0
    current_value: float = 0.0

class DeviceCreate(DeviceBase):
    pass

class DeviceResponse(DeviceBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, extra="allow")

class DiagnosisRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    device_id: Optional[int] = None
    device: Optional[Dict[str, Any]] = None
    device_type: Optional[str] = "Smartphone"
    brand: Optional[str] = ""
    model: Optional[str] = ""
    purchase_date: Optional[str] = ""
    purchase_price: Optional[float] = 0.0
    current_value: Optional[float] = 0.0
    symptoms: List[str] = Field(default_factory=list)
    history: Optional[Dict[str, Any]] = Field(default_factory=dict)
    description: Optional[str] = ""
    repair_cost: Optional[float] = None
    symptom_duration: Optional[str] = "recent"
    context_answers: Optional[Dict[str, Any]] = Field(default_factory=dict)
    previous_repairs: Optional[Any] = Field(default_factory=list)

class ProbableCause(BaseModel):
    model_config = ConfigDict(extra="allow")

    name: str
    probability: int
    score: Optional[int] = None
    severity: str = "Medium"
    description: str
    reason: Optional[str] = None
    rank: Optional[int] = 1
    why_we_think_this: Optional[List[str]] = Field(default_factory=list)

class RecoveryOptions(BaseModel):
    model_config = ConfigDict(extra="allow")

    replaceable_components: List[str] = Field(default_factory=list)
    recoverable_data: bool = True
    recoverable_components: List[str] = Field(default_factory=list)
    reusable_components: Optional[List[str]] = Field(default_factory=list)
    physical_inspection_required: bool = False

class ActionItem(BaseModel):
    model_config = ConfigDict(extra="allow")

    step: int
    title: str
    description: str
    detail: Optional[str] = None
    priority: str = "MEDIUM"

class TechnicianQuestion(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: int
    question: str
    why_it_matters: Optional[str] = ""

class DiagnosisResponse(BaseModel):
    model_config = ConfigDict(extra="allow")

    success: Optional[bool] = True
    diagnosis_id: str
    id: Optional[str] = None
    device_id: Optional[int] = None
    device: Optional[str] = ""
    device_name: Optional[str] = ""
    device_type: Optional[str] = ""
    brand: Optional[str] = ""
    model: Optional[str] = ""
    purchase_date: Optional[str] = ""
    purchase_price: Optional[float] = 0.0
    current_value: Optional[float] = 0.0
    health_score: int
    healthScore: Optional[int] = None
    health_status: Optional[str] = ""
    healthStatus: Optional[str] = ""
    status: str
    repairability_score: int
    repairabilityScore: Optional[int] = None
    repairabilityStatus: Optional[str] = ""
    probable_causes: List[ProbableCause] = Field(default_factory=list)
    probableCauses: Optional[List[Any]] = Field(default_factory=list)
    component_health: Dict[str, int] = Field(default_factory=dict)
    componentHealth: Optional[Dict[str, int]] = Field(default_factory=dict)
    recovery: Optional[RecoveryOptions] = None
    recovery_options: Optional[RecoveryOptions] = None
    recoveryAnalysis: Optional[Any] = None
    recommendation: str
    recommendation_reason: Optional[str] = ""
    what_probably_happened: str
    whatProbablyHappened: Optional[str] = ""
    repair_estimate: Optional[Dict[str, Any]] = None
    repairVsReplace: Optional[Dict[str, Any]] = None
    action_plan: List[ActionItem] = Field(default_factory=list)
    actionPlan: Optional[List[Any]] = Field(default_factory=list)
    technician_questions: List[TechnicianQuestion] = Field(default_factory=list)
    technicianQuestions: Optional[List[Any]] = Field(default_factory=list)
    created_at: Optional[str] = None

class ReportSummary(BaseModel):
    model_config = ConfigDict(extra="allow")

    diagnosis_id: str
    device_name: str
    device_type: str
    health_score: int
    repairability_score: int
    recommendation: str
    status: str
    primary_cause: str
    created_at: str

class InsightsResponse(BaseModel):
    model_config = ConfigDict(extra="allow")

    total_diagnosed: int
    potentially_repairable_pct: int
    repair_opportunities_count: int
    replacement_avoided_value: str
    most_common_issue: str
    issue_distribution: List[Dict[str, Any]]
    repair_vs_replace_stats: Dict[str, int]
    recovery_stats: Dict[str, int]
    key_findings: List[str]

class ConversationMessage(BaseModel):
    model_config = ConfigDict(extra="allow")
    sender: str
    text: str

class DeviceContext(BaseModel):
    model_config = ConfigDict(extra="allow")
    device_name: Optional[str] = None
    device_type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    device_age: Optional[str] = None
    purchase_date: Optional[str] = None
    current_value: Optional[float] = None
    symptoms: Optional[List[str]] = Field(default_factory=list)
    prior_event: Optional[str] = None
    problem_started: Optional[str] = None
    current_condition: Optional[str] = None
    previous_repairs: Optional[str] = None
    health_score: Optional[int] = None
    repairability_score: Optional[int] = None
    recommendation: Optional[str] = None
    component_risks: Optional[Dict[str, Any]] = Field(default_factory=dict)
    probable_causes: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    component_health: Optional[Dict[str, Any]] = Field(default_factory=dict)
    last_topic: Optional[str] = None

class AssistantRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    message: str
    history: Optional[List[ConversationMessage]] = Field(default_factory=list)
    context: Optional[DeviceContext] = None

class AssistantResponse(BaseModel):
    model_config = ConfigDict(extra="allow")
    response: str
    suggested_prompts: List[str] = Field(default_factory=list)
    detected_topic: Optional[str] = None
    active_device: Optional[str] = None
    updated_context: Optional[Dict[str, Any]] = None
