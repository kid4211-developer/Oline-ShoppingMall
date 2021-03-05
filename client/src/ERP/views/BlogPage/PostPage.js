import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button, List, Avatar, Card } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
const { Title } = Typography;
const { Meta } = Card;

const MainDiv = styled.div`
    max-width: 850px;
    margin: 3rem auto;
    border: 2px solid #e5e5e5;
    padding: 2rem;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

function PostPage(props) {
    const user = useSelector((state) => state.user);
    const [post, setPost] = useState([]);
    const postId = props.match.params.postId;

    useEffect(() => {
        const variable = { postId: postId };

        axios.post('/api/blog/getPost', variable).then((response) => {
            if (response.data.success) {
                setPost(response.data.post);
            } else {
                alert('Couldnt get post');
            }
        });
    }, []);

    const postDelete = () => {
        console.log('삭제', post);
        axios.post('/api/blog/deletePost', post).then((response) => {
            if (response.data.success) {
                console.log('포스트 삭제', response.data.success);
                props.history.push('/blog');
            } else {
                alert(`Couldn't delete this post`);
            }
        });
    };

    if (post.writer) {
        console.log('Post Detail', post);
        return (
            <MainDiv>
                <Title level={2}>Blog Post</Title>
                <br />
                {user.userData && user.userData.image && (
                    <Meta
                        avatar={<Avatar size={48} src={user.userData.image} />}
                        title={post.writer.name}
                        description={moment(post.date).format('YY-MM-DD HH:MM a')}
                        style={{
                            borderBottom: '1px solid #e5e5e5',
                            paddingBottom: '1rem',
                            fontSize: '15px',
                        }}
                    />
                )}
                <br />
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={{
                        minHeight: '300px',
                        overflowY: 'scroll',
                        maxWidth: '720px',
                        margin: '1rem auto 2rem',
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        borderTop: '2px solid #e5e5e5',
                        justifyContent: 'flex-end',
                        paddingTop: '1rem',
                    }}
                >
                    <Button onClick={postDelete}>Delete</Button>
                </div>
            </MainDiv>
        );
    } else {
        return <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>;
    }
}

export default PostPage;
