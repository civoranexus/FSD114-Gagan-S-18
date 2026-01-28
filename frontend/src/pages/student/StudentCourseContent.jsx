import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentCourseContent = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markingComplete, setMarkingComplete] = useState({});

    useEffect(() => {
        fetchCourseContent();
        fetchProgress();
    }, [id]);

    const fetchCourseContent = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await axios.get(`http://127.0.0.1:8000/api/courses/student/${id}/contents/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourseData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching course content');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await axios.get(`http://127.0.0.1:8000/api/courses/student/${id}/progress/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(response.data);
        } catch (err) {
            console.error('Error fetching progress:', err);
        }
    };

    const handleMarkComplete = async (contentId) => {
        setMarkingComplete(prev => ({ ...prev, [contentId]: true }));
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/courses/student/${contentId}/complete/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update UI instantly
            setCourseData(prev => ({
                ...prev,
                contents: prev.contents.map(content =>
                    content.id === contentId ? { ...content, completed: true } : content
                )
            }));
            
            // Fetch updated progress
            fetchProgress();
        } catch (err) {
            alert(err.response?.data?.error || 'Error marking content as completed');
        } finally {
            setMarkingComplete(prev => ({ ...prev, [contentId]: false }));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!courseData) return <div>Course not found</div>;

    const handleDownloadCertificate = () => {
        // Placeholder for certificate download logic
        alert('Certificate download feature coming soon!');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>{courseData.course_title}</h1>
                {progress?.is_completed && (
                    <div style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                    }}>
                        ✓ Course Completed
                    </div>
                )}
            </div>
            
            {progress && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0' }}>Your Progress</h3>
                            <p style={{ margin: 0 }}><strong>{progress.completed_content} of {progress.total_content} completed</strong></p>
                        </div>
                        {progress.is_completed && (
                            <button
                                onClick={handleDownloadCertificate}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                📜 Download Certificate
                            </button>
                        )}
                        {!progress.is_completed && (
                            <button
                                disabled
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#ccc',
                                    color: '#666',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'default',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                📜 Download Certificate
                            </button>
                        )}
                    </div>
                    <div style={{
                        width: '100%',
                        backgroundColor: '#ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: '24px'
                    }}>
                        <div style={{
                            width: `${progress.progress_percentage}%`,
                            backgroundColor: '#4CAF50',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transition: 'width 0.3s ease'
                        }}>
                            {progress.progress_percentage > 10 && `${progress.progress_percentage}%`}
                        </div>
                    </div>
                </div>
            )}
            
            {courseData.contents.length === 0 ? (
                <p>No content available for this course yet.</p>
            ) : (
                <div>
                    <h2>Course Materials</h2>
                    {courseData.contents.map(content => (
                        <div key={content.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3>{content.title}</h3>
                                    <p><strong>Type:</strong> {content.content_type}</p>
                                    <p style={{ color: content.completed ? 'green' : '#666' }}>
                                        {content.completed ? '✓ Completed' : 'Not completed'}
                                    </p>
                                    <a 
                                        href={content.file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        Open Resource
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleMarkComplete(content.id)}
                                    disabled={content.completed || markingComplete[content.id]}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: content.completed ? '#ccc' : '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: content.completed ? 'default' : 'pointer',
                                        marginLeft: '10px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {markingComplete[content.id] ? 'Marking...' : content.completed ? 'Completed' : 'Mark Complete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentCourseContent;


