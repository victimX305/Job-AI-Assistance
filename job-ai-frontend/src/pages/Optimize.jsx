import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../api/axios";

export default function Optimizer() {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [jobText, setJobText] = useState("");
  const [optimized, setOptimized] = useState("");

  useEffect(() => {
    api.get(`/cv`).then(res => {
      const found = res.data.find(item => item.id === parseInt(id));
      setCv(found);
    });
  }, [id]);

  const optimize = async () => {
    const res = await api.post("/optimize", {
      cv_text: cv.cv_text,
      job_text: jobText
    });

    setOptimized(res.data.optimized_text);
  };

  if (!cv) return <Container>Loading...</Container>;

  return (
    <Container>
      <h1>Optimize CV</h1>

      <Card>
        <h3>{cv.role_category}</h3>
        <TextArea
          placeholder="Paste Job Description Here"
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        />

        <Button onClick={optimize}>Optimize CV</Button>
      </Card>

      {optimized && (
        <ResultCard>
          <h2>Optimized CV</h2>
          <pre>{optimized}</pre>
        </ResultCard>
      )}
    </Container>
  );
}

/* Styled Components */

const Container = styled.div`
  padding: 40px;
  background: #f4f6f8;
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const ResultCard = styled(Card)`
  white-space: pre-wrap;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  margin: 15px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  background: #111827;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;