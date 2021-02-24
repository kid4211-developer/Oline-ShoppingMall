import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button } from 'antd';
const { Title } = Typography;

function PostPage(props) {
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
            <div className="postPage" style={{ width: '80%', margin: '3rem auto' }}>
                <Title level={2}>{post.writer.name}`s Post</Title>
                <br />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        borderBottom: '2px solid #e5e5e5',
                        marginBottom: '1rem',
                    }}
                >
                    <Title level={4}>{post.date}</Title>
                </div>
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={{
                        marginBottom: '1rem',
                        height: '560px',
                        overflowY: 'scroll',
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
            </div>
        );
    } else {
        return <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>;
    }
}

export default PostPage;
