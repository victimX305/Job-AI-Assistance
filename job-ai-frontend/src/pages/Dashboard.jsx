import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../api/axios";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs")
      .then(res => setJobs(res.data))
      .catch(() => navigate("/login"));
  }, []);

  return (
    <Container>
      <Header>AI Job Dashboard</Header>

      <StatsCard>
        <h2>Total Saved Jobs</h2>
        <StatNumber>{jobs.length}</StatNumber>
      </StatsCard>

      <ButtonGroup>
        <PrimaryButton onClick={() => navigate("/cv")}>
          Manage Master CVs
        </PrimaryButton>

        <SecondaryButton onClick={() => navigate("/jobs")}>
          Manage Job Posts
        </SecondaryButton>
      </ButtonGroup>
    </Container>
  );
}

/* ========== Styled Components ========== */

const Container = styled.div`
  padding: 40px;
  background: #f4f6f8;
  min-height: 100vh;
`;

const Header = styled.h1`
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const StatsCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  margin-bottom: 40px;
`;

const StatNumber = styled.div`
  font-size: 42px;
  font-weight: bold;
  margin-top: 10px;
  color: #111827;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const PrimaryButton = styled.button`
  background: #111827;
  color: white;
  padding: 14px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #1f2937;
  }
`;

const SecondaryButton = styled.button`
  background: #e5e7eb;
  color: #111827;
  padding: 14px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #d1d5db;
  }
`;