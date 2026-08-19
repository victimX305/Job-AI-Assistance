import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api/axios";

export default function CVManager() {
  const [cvs, setCvs] = useState([]);
  const [roleCategory, setRoleCategory] = useState("");
  const [cvText, setCvText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCV, setCurrentCV] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [filteredCVs, setFilteredCVs] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchCVs = async () => {
    const res = await api.get("/cv");
    setCvs(res.data);
    setFilteredCVs(res.data);
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  useEffect(() => {
    const result = cvs.filter(cv =>
      cv.role_category.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCVs(result);
  }, [filter, cvs]);

  const createCV = async () => {
    if (!roleCategory || !cvText) return alert("Fill all fields");

    await api.post("/cv", {
      role_category: roleCategory,
      cv_text: cvText,
    });

    setRoleCategory("");
    setCvText("");
    fetchCVs();
  };

  const deleteCV = async (id) => {
    await api.delete(`/cv/${id}`);
    fetchCVs();
  };

  const updateCV = async () => {
    await api.put(`/cv/${currentCV.id}`, {
      role_category: currentCV.role_category,
      cv_text: currentCV.cv_text,
    });

    setIsEditing(false);
    setCurrentCV(null);
    fetchCVs();
  };

  return (
    <Container>
      <Header>Master CV Manager</Header>

      <Card>
        <Input
          placeholder="Role Category (e.g. Software Developer)"
          value={roleCategory}
          onChange={(e) => setRoleCategory(e.target.value)}
        />
        <TextArea
          placeholder="Paste or write your CV text here..."
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />
        <Button onClick={createCV}>Create CV</Button>
      </Card>


      <Input
        placeholder="Filter by role..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredCVs.length === 0 ? (
  <EmptyState>
    No CVs found. Create your first one 🚀
  </EmptyState>
) : (
  <CVGrid>
    {filteredCVs.map((cv) => (
      <CVCard key={cv.id}>
        <h3>{cv.role_category}</h3>
        <p>{cv.cv_text.substring(0, 200)}...</p>

        <ActionRow>
          <PreviewButton onClick={() => {
            setCurrentCV(cv);
            setIsPreview(true);
          }}>
            Preview
          </PreviewButton>

          <EditButton onClick={() => {
            setCurrentCV(cv);
            setIsEditing(true);
          }}>
            Edit
          </EditButton>

          <OptimizeButton onClick={() => navigate(`/optimize/${cv.id}`)}>
            Optimize
          </OptimizeButton>

          <DeleteButton onClick={() => deleteCV(cv.id)}>
            Delete
          </DeleteButton>
        </ActionRow>
      </CVCard>
    ))}
  </CVGrid>
)}

      {isEditing && (
        <ModalOverlay>
        <Modal>
          <h2>Edit CV</h2>

          <Input
            value={currentCV.role_category}
            onChange={(e) =>
               setCurrentCV({
                ...currentCV,
                 role_category: e.target.value,
              })
            }
          />

          <TextArea
            value={currentCV.cv_text}
            onChange={(e) =>
              setCurrentCV({
                ...currentCV,
                cv_text: e.target.value,
              })
            }
         />
         <SmallText>
           {currentCV?.cv_text?.length || 0} characters
         </SmallText>

          <ModalButtons>
            <Button onClick={updateCV}>Save Changes</Button>
            <CancelButton onClick={() => setIsEditing(false)}>
              Cancel
             </CancelButton>
           </ModalButtons>
         </Modal>
       </ModalOverlay>
     )}
      
      {isPreview && (
        <ModalOverlay>
          <Modal>
            <h2>{currentCV.role_category}</h2>
            <pre style={{whiteSpace: "pre-wrap"}}>
              {currentCV.cv_text}
            </pre>
            <CancelButton onClick={() => setIsPreview(false)}>
              Close
            </CancelButton>
          </Modal>
        </ModalOverlay>
      )}
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

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-height: 120px;
  font-size: 14px;
`;

const Button = styled.button`
  background: #111827;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #1f2937;
  }
`;

const CVGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const CVCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.04);

  h3 {
    margin-bottom: 10px;
  }

  p {
    font-size: 13px;
    color: #555;
  }
`;

const DeleteButton = styled.button`
  margin-top: 15px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background: #2563eb;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  width: 500px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`;

const SmallText = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-align: right;
`;

const EmptyState = styled.div`
  background: white;
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  color: #6b7280;
  box-shadow: 0 6px 15px rgba(0,0,0,0.04);
`;

const PreviewButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #059669;
  }
`;

const OptimizeButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #7c3aed;
  }
`;