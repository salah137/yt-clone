"use client"

import ky from "ky"
import { useEffect, useRef, useState } from "react"
import { Comment } from "@/models"
import Loader from "../component"


export function Comments(props: { videoId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [first, setFirst] = useState(true)
    const [content, setContent] = useState("")
    const [isBottom, setIsBottom] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null)
    const [sending,setSending] = useState(false)

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (!container) return;

      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

    useEffect(
        () => {
        if (isBottom){
            (async () => {
                if (first) {
                    setLoading(true)
                    const res = await ky.get("/api/videos/comments/getAllComments?videoId=" + props.videoId)
                    if (res.ok) {
                        const data = await res.json() as unknown as { data: Comment[] }
                        console.log(data);

                        setComments(data!.data)
                        setFirst(false)
                        setLoading(false)
                        return
                    }
                } else {
                    const res = await ky.get("/api/videos/comments/getAllComments?videoId=" + props.videoId + "&skip=" + (comments.length-1))
                    const data = await res.json() as unknown as { data: Comment[] }
                    setComments(
                        (prev) => {
                            return [...prev, ...data.data]
                        }
                    )
                }
            
            })()}
            setIsBottom(false)
        }, [isBottom]
    )
    return <div className="lg:w-[30vw] ]">
        <div className="flex items-center justify-around lg:h-[20vh]">
            <textarea
                value={content}
                onChange={
                    (e) => {
                        setContent(e.target.value)
                    }
                }
                placeholder="write a comment"
                className="bg-[#EEF4D4] outline-0 p-4 text-md rounded-md w-[70%] mt-2 text-[#2A2222]"
            />
            <button className="bg-[#EEF4D4] h-fit p-4 text-md rounded-md hover:bg-[#e6f3a9] text-[#2A2222]" onClick={
                async () => {
                    if (content && !sending) {
                        setSending(true)

                        const res = await ky.post(
                            "/api/videos/comments/addComment",
                            {
                                json: {
                                    content: content,
                                    videoId: props.videoId
                                }
                            }
                        )

                        setSending(false)
                        setIsBottom(true)
                    }
                }
            }>
                {sending? 
                <div className="flex items-center justify-center w-full h-full">
      <div className=" border-4 border-[#2A2222]  rounded-full animate-spin"></div>
    </div>
                : "Done"}
            </button>
        </div>

        <div className="lg:h-[80vh] p-5 overflow-scroll scrollbar-hide w-full" ref= {containerRef}>
            {
                loading ? <Loader />
                    : comments.map(
                        (e, i) => {
                            console.log(e);

                            return <CommentCompoenent comment={e} key={i}></CommentCompoenent>
                        }
                    )
            }
        </div>
    </div>
}

function CommentCompoenent(props: {
    comment: Comment
}) {

    return <div className="border-b-2 border-b-[#EEF4D4] mb-4 w-full">
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center ">
                <div className="p-3 rounded-full bg-[#EEF4D4] h-[4vh] w-[4vh] mr-2 text-[#2A2222] flex justify-center items-center">{props.comment.userName[0]}</div>
                <h3>{props.comment.userName}</h3>
            </div>
            <h3>       {new Date(props.comment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
            }</h3>
        </div>
        <p className="p-4">{props.comment.content}</p>
    </div>
}