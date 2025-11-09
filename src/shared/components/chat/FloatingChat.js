import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  arrayRemove,
  getDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../core/firebase/config";
import { useAuth } from "../../../core/contexts/AuthContext";

// 채팅 버튼 (우측 하단 고정)
const FloatingChatButton = styled.button`
  position: fixed !important;
  bottom: 30px !important;
  right: 30px !important;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #000000;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex !important;
  align-items: center;
  justify-content: center;
  z-index: 9999 !important;
  transition: all 0.3s ease;
  overflow: visible;

  ion-icon {
    font-size: 32px;
    color: white;
    pointer-events: none;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    background: #1a1a1a;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 20px !important;
    right: 20px !important;
    width: 56px;
    height: 56px;

    ion-icon {
      font-size: 28px;
    }
  }
`;

const ChatButtonBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ef4444;
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.35);
`;

// 채팅 목록 모달
const ChatListModal = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 360px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 9998;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
  }
`;

const ChatListHeader = styled.div`
  padding: 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const ChatItem = styled.div`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  gap: 12px;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.colors.gray[100]};
  }
`;

const ChatAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 4px;
`;

const ChatLastMessage = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const ChatTime = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.gray[500]};
`;

const ChatBadge = styled.div`
  background: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const EmptyMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[500]};
  font-size: 0.95rem;
`;

// 채팅방 박스 (우측 하단)
const ChatRoomBox = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: ${(props) => (props.isExpanded ? "800px" : "400px")};
  height: ${(props) => (props.isExpanded ? "700px" : "550px")};
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 9999;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: ${(props) => (props.isExpanded ? "100vh" : "70vh")};
    border-radius: 16px 16px 0 0;
  }
`;

const ChatRoomHeader = styled.div`
  padding: 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
`;

const ExpandButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const LeaveButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.8rem;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  gap: 10px;
`;

const MessageBubble = styled.div`
  padding: 10px 14px;
  border-radius: 16px;
  background: ${(props) => (props.isMine ? props.theme.gradients.primary : "#ffffff")};
  color: ${(props) => (props.isMine ? "white" : props.theme.colors.dark)};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  line-height: 1.35;
`;

const MessageCluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 16px;
`;
const MessageBubbleRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  justify-content: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
`;

const MessageTimeInline = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.gray[500]};
  white-space: nowrap;
`;

const ChatInputArea = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  gap: 12px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: 24px;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingState = styled.div`
  padding: 24px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[500]};
  font-size: 0.9rem;
`;

const MESSAGE_TIME_GAP_MS = 30 * 1000;

const FloatingChat = () => {
  const { currentUser } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomsLoading, setChatRoomsLoading] = useState(true);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const totalUnread = useMemo(() => {
    if (!currentUser) return 0;
    return chatRooms.reduce(
      (sum, room) => sum + (room.unreadCounts?.[currentUser.uid] || 0),
      0
    );
  }, [chatRooms, currentUser]);

  // 채팅방 구독
  useEffect(() => {
    if (!currentUser) {
      setChatRooms([]);
      setChatRoomsLoading(false);
      return;
    }

    setChatRoomsLoading(true);
    const chatRoomsRef = collection(db, "chatRooms");
    const chatQuery = query(
      chatRoomsRef,
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      chatQuery,
      (snapshot) => {
        const rooms = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        rooms.sort((a, b) => {
          const aTime = a.updatedAt?.toMillis?.() || a.updatedAt?.milliseconds || 0;
          const bTime = b.updatedAt?.toMillis?.() || b.updatedAt?.milliseconds || 0;
          return bTime - aTime;
        });

        setChatRooms(rooms);
        setChatRoomsLoading(false);
      },
      (error) => {
        console.error("채팅방 로드 실패:", error);
        setChatRooms([]);
        setChatRoomsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const selectedChatRoom = useMemo(() => {
    if (!selectedChatRoomId) return null;
    return chatRooms.find((room) => room.id === selectedChatRoomId) || null;
  }, [chatRooms, selectedChatRoomId]);

  // 메시지 구독
  useEffect(() => {
    if (!selectedChatRoomId) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    const messagesRef = collection(db, "chatRooms", selectedChatRoomId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
        setMessages(fetchedMessages);
        setMessagesLoading(false);
      },
      (error) => {
        console.error("채팅 메시지 로드 실패:", error);
        setMessages([]);
        setMessagesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedChatRoomId]);

  useEffect(() => {
    if (!currentUser || !selectedChatRoomId) return;
    const room = chatRooms.find((r) => r.id === selectedChatRoomId);
    if (!room) return;

    const currentUnread = room.unreadCounts?.[currentUser.uid] || 0;
    if (currentUnread > 0) {
      updateDoc(doc(db, "chatRooms", selectedChatRoomId), {
        [`unreadCounts.${currentUser.uid}`]: 0,
      }).catch((error) => {
        console.error("채팅 읽음 처리 실패:", error);
      });
    }
  }, [chatRooms, currentUser, selectedChatRoomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedChatRoomId, isChatExpanded]);

  const formatListTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getOtherParticipantProfile = (room) => {
    if (!currentUser || !room) return null;
    const participantProfiles = room.participantProfiles || {};
    const otherEntries = Object.entries(participantProfiles).filter(
      ([participantId]) => participantId !== currentUser.uid
    );

    if (otherEntries.length > 0) {
      return otherEntries[0][1] || { displayName: "상대방" };
    }

    const otherId = room.participants?.find((id) => id !== currentUser.uid);
    if (!otherId) return null;

    return participantProfiles[otherId] || { displayName: "상대방" };
  };

  const toggleChatList = () => {
    setIsChatListOpen((prev) => !prev);
    setSelectedChatRoomId(null);
  };

  const handleChatRoomClick = (room) => {
    setSelectedChatRoomId(room.id);
    setIsChatListOpen(false);
  };

  const handleBackToChatList = () => {
    setSelectedChatRoomId(null);
    setIsChatListOpen(true);
    setIsChatExpanded(false);
  };

  const toggleChatExpand = () => {
    setIsChatExpanded((prev) => !prev);
  };

  const handleLeaveChatRoom = async () => {
    if (!currentUser || !selectedChatRoomId || !selectedChatRoom) return;
    const confirmed = window.confirm("채팅방을 나가시겠습니까? 나가면 대화 내용이 삭제됩니다.");
    if (!confirmed) return;

    try {
      const chatRoomRef = doc(db, "chatRooms", selectedChatRoomId);

      await updateDoc(chatRoomRef, {
        participants: arrayRemove(currentUser.uid),
        [`participantProfiles.${currentUser.uid}.leftAt`]: serverTimestamp(),
        [`unreadCounts.${currentUser.uid}`]: 0,
        updatedAt: serverTimestamp(),
      });

      const chatRoomSnap = await getDoc(chatRoomRef);
      if (chatRoomSnap.exists()) {
        const remainingParticipants = chatRoomSnap.data()?.participants || [];
        if (remainingParticipants.length === 0) {
          await deleteChatRoomCompletely(selectedChatRoomId);
        }
      }

      setSelectedChatRoomId(null);
      setMessages([]);
      setIsChatExpanded(false);
      setIsChatListOpen(false);
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      alert("채팅방을 나가지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !currentUser || !selectedChatRoomId) return;

    const room = selectedChatRoom;
    if (!room) return;

    try {
      const messagesRef = collection(db, "chatRooms", selectedChatRoomId, "messages");
      await addDoc(messagesRef, {
        text,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      const unreadUpdates = {};
      (room.participants || []).forEach((participantId) => {
        unreadUpdates[`unreadCounts.${participantId}`] =
          participantId === currentUser.uid
            ? 0
            : (room.unreadCounts?.[participantId] || 0) + 1;
      });

      await updateDoc(doc(db, "chatRooms", selectedChatRoomId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...unreadUpdates,
      });

      setMessageInput("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const messageClusters = useMemo(() => {
    const clusters = [];
    let currentCluster = null;

    messages.forEach((message) => {
      const createdAt =
        message.createdAt?.toDate?.() ||
        (message.createdAt ? new Date(message.createdAt) : null);

      if (!currentCluster) {
        currentCluster = {
          senderId: message.senderId,
          messages: [message],
          lastTimestamp: createdAt,
        };
        clusters.push(currentCluster);
        return;
      }

      const sameSender = currentCluster.senderId === message.senderId;
      const withinTimeGap =
        createdAt &&
        currentCluster.lastTimestamp &&
        createdAt - currentCluster.lastTimestamp <= MESSAGE_TIME_GAP_MS;

      if (sameSender && withinTimeGap) {
        currentCluster.messages.push(message);
        currentCluster.lastTimestamp = createdAt;
      } else {
        currentCluster = {
          senderId: message.senderId,
          messages: [message],
          lastTimestamp: createdAt,
        };
        clusters.push(currentCluster);
      }
    });

    return clusters;
  }, [messages]);

  const hasParticipantLeft = (participantId) => {
    const profile = selectedChatRoom?.participantProfiles?.[participantId];
    return !!profile?.leftAt;
  };

  const otherParticipantInfo = useMemo(() => {
    if (!currentUser || !selectedChatRoom) return null;
    const participantProfiles = selectedChatRoom.participantProfiles || {};
    const entries = Object.entries(participantProfiles);
    for (const [participantId, profile] of entries) {
      if (participantId !== currentUser.uid) {
        return { id: participantId, profile };
      }
    }
    return null;
  }, [currentUser, selectedChatRoom]);

  const otherParticipantLeft = useMemo(() => {
    if (!selectedChatRoom || !otherParticipantInfo) {
      return selectedChatRoom && (selectedChatRoom.participants?.length || 0) <= 1;
    }

    const stillParticipant =
      selectedChatRoom.participants?.includes(otherParticipantInfo.id) ?? false;
    const leftAt = otherParticipantInfo.profile?.leftAt;

    return !stillParticipant || !!leftAt;
  }, [selectedChatRoom, otherParticipantInfo]);

  const deleteChatRoomCompletely = async (chatRoomId) => {
    try {
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      const messagesRef = collection(chatRoomRef, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      await Promise.all(messagesSnapshot.docs.map((messageDoc) => deleteDoc(messageDoc.ref)));
      await deleteDoc(chatRoomRef);
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <FloatingChatButton onClick={toggleChatList}>
        <ion-icon name="chatbubbles-outline"></ion-icon>
        {totalUnread > 0 && (
          <ChatButtonBadge>{totalUnread > 99 ? "99+" : totalUnread}</ChatButtonBadge>
        )}
      </FloatingChatButton>

      <ChatListModal isOpen={isChatListOpen}>
        <ChatListHeader>
          <span>채팅 목록</span>
          <CloseButton onClick={() => setIsChatListOpen(false)}>×</CloseButton>
        </ChatListHeader>

        <ChatList>
          {chatRoomsLoading ? (
            <LoadingState>채팅 목록을 불러오는 중입니다...</LoadingState>
          ) : chatRooms.length === 0 ? (
            <EmptyMessage>진행 중인 채팅이 없습니다.</EmptyMessage>
          ) : (
            chatRooms.map((room) => {
              const other = getOtherParticipantProfile(room);
              const unreadCount = room.unreadCounts?.[currentUser.uid] || 0;
              return (
                <ChatItem key={room.id} onClick={() => handleChatRoomClick(room)}>
                  <ChatAvatar>{other?.displayName?.[0] || "채"}</ChatAvatar>
                  <ChatInfo>
                    <ChatName>{other?.displayName || "상대방"}</ChatName>
                    <ChatLastMessage>{room.lastMessage || "새 대화가 생성되었습니다."}</ChatLastMessage>
                  </ChatInfo>
                  <ChatMeta>
                    <ChatTime>{formatListTimestamp(room.lastMessageAt || room.updatedAt)}</ChatTime>
                    {unreadCount > 0 && <ChatBadge>{unreadCount}</ChatBadge>}
                  </ChatMeta>
                </ChatItem>
              );
            })
          )}
        </ChatList>
      </ChatListModal>

      {selectedChatRoom && (
        <ChatRoomBox isOpen={!!selectedChatRoom} isExpanded={isChatExpanded}>
          <ChatRoomHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <BackButton onClick={handleBackToChatList}>←</BackButton>
              <span>{getOtherParticipantProfile(selectedChatRoom)?.displayName || "상대방"}</span>
            </div>
            <HeaderActions>
              <ExpandButton onClick={toggleChatExpand}>
                {isChatExpanded ? "축소" : "확대"}
              </ExpandButton>
              <LeaveButton onClick={handleLeaveChatRoom}>나가기</LeaveButton>
            </HeaderActions>
          </ChatRoomHeader>

          <ChatMessages>
            {messagesLoading ? (
              <LoadingState>메시지를 불러오는 중입니다...</LoadingState>
            ) : messageClusters.length === 0 ? (
              <EmptyMessage>첫 메시지를 보내보세요.</EmptyMessage>
            ) : (
              messageClusters.map((cluster, clusterIndex) => (
                <MessageCluster key={`cluster-${clusterIndex}`}>
                  {cluster.messages.map((message, messageIndex) => {
                    const isMine = message.senderId === currentUser.uid;
                    const createdAt = message.createdAt;
                    const showTime = messageIndex === cluster.messages.length - 1;

                    return (
                      <Message key={message.id} isMine={isMine}>
                        <MessageWrapper>
                          {showTime ? (
                            <MessageBubbleRow isMine={isMine}>
                              {isMine && (
                                <MessageTimeInline>{formatMessageTime(createdAt)}</MessageTimeInline>
                              )}
                              <MessageBubble isMine={isMine}>{message.text}</MessageBubble>
                              {!isMine && (
                                <MessageTimeInline>{formatMessageTime(createdAt)}</MessageTimeInline>
                              )}
                            </MessageBubbleRow>
                          ) : (
                            <MessageBubble isMine={isMine}>{message.text}</MessageBubble>
                          )}
                        </MessageWrapper>
                      </Message>
                    );
                  })}
                </MessageCluster>
              ))
            )}
            <div ref={messagesEndRef} />
            {otherParticipantLeft && (
              <EmptyMessage>
                상대방이 채팅방에서 나갔습니다. 이 대화는 읽기 전용입니다.
              </EmptyMessage>
            )}
          </ChatMessages>

          <ChatInputArea>
            <ChatInput
              type="text"
              placeholder={
                otherParticipantLeft ? "상대방이 나간 대화입니다." : "메시지를 입력하세요..."
              }
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyPress={handleKeyPress}
              disabled={otherParticipantLeft}
            />
            <SendButton onClick={handleSendMessage} disabled={otherParticipantLeft}>
              전송
            </SendButton>
          </ChatInputArea>
        </ChatRoomBox>
      )}
    </>
  );
};

export default FloatingChat;

