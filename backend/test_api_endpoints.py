from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing GET /")
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.status_code}"
    print(" Root status:", r.json()["status"])

    print("Testing GET /api/cycles")
    r = client.get("/api/cycles")
    assert r.status_code == 200
    print(f" Retrieved {len(r.json())} cycles")

    print("Testing GET /api/cycles/prediction")
    r = client.get("/api/cycles/prediction")
    assert r.status_code == 200
    pred = r.json()
    print(" Cycle prediction next period:", pred["next_period_start"], "Confidence:", pred["confidence_level"])

    print("Testing GET /api/health-log")
    r = client.get("/api/health-log")
    assert r.status_code == 200
    print(f" Retrieved {len(r.json())} health logs")

    print("Testing GET /api/ai/insights")
    r = client.get("/api/ai/insights")
    assert r.status_code == 200
    insights = r.json()
    print(f" Retrieved {insights['total_insights']} AI insights")

    print("Testing GET /api/ai/patterns")
    r = client.get("/api/ai/patterns")
    assert r.status_code == 200
    patterns = r.json()
    print(" Patterns sleep correlation:", patterns.get("sleep_energy_correlation"))

    print("Testing GET /api/ai/changes")
    r = client.get("/api/ai/changes")
    assert r.status_code == 200
    changes = r.json()
    print(" Changes report:", changes.get("analysis_period"))

    print("Testing GET /api/ai/recommendations")
    r = client.get("/api/ai/recommendations")
    assert r.status_code == 200
    recs = r.json()
    print(f" Generated {len(recs)} personalized recommendations")

    print("Testing GET /api/pregnancy")
    r = client.get("/api/pregnancy")
    assert r.status_code == 200
    preg = r.json()
    print(" Pregnancy active:", preg.get("is_active"))

    print("Testing GET /api/demo/status")
    r = client.get("/api/demo/status")
    assert r.status_code == 200
    status = r.json()
    print(" Demo status:", status)

    print("\nALL FASTAPI REST ENDPOINTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
