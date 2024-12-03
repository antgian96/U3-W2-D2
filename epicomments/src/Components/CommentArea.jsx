import React, { useState, useEffect } from 'react';
import { ListGroup, Alert, Spinner } from 'react-bootstrap';

const CommentArea = ({ selectedAsin }) => {
  const [comments, setComments] = useState([]); // Stato per i commenti
  const [loading, setLoading] = useState(false); // Stato per il caricamento
  const [error, setError] = useState(false); // Stato per eventuali errori

  // Effetto per recuperare i commenti ogni volta che `selectedAsin` cambia
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedAsin) return; // Non fare nulla se `selectedAsin` non è definito

      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `https://striveschool-api.herokuapp.com/api/comments/${selectedAsin}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3NDc1YmFlZGU3ODAwMTU3OTM2MTEiLCJpYXQiOjE3MzMxNDg1MTUsImV4cCI6MTczNDM1ODExNX0.A9o4bmgD2tG6w0XP5whI7iiRH9tUBVbhULiWzZ0EVH0",
            },
          }
        );

        if (!response.ok) throw new Error("Errore durante il fetch");

        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Errore durante la fetch:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [selectedAsin]); // Dipendenza: effetto eseguito quando cambia `selectedAsin`

  return (
    <div>
      {!selectedAsin ? (
        <Alert variant="info">Seleziona un libro per visualizzare i commenti.</Alert>
      ) : loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <Alert variant="danger">
          Si è verificato un errore durante il caricamento dei commenti. Riprova più tardi.
        </Alert>
      ) : comments.length > 0 ? (
        <>
          <h3>Commenti per ASIN {selectedAsin}</h3>
          <ListGroup>
            {comments.map((comment, index) => (
              <ListGroup.Item key={index}>
                <strong>{comment.author}: </strong>
                {comment.comment}
                <span className="text-muted ml-2">(Valutazione: {comment.rate})</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <Alert variant="warning">Non ci sono commenti disponibili per questo libro.</Alert>
      )}
    </div>
  );
};

export default CommentArea;
