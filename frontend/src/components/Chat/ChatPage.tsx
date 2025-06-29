import { useEffect, useState } from "react";
import { sb } from "../../lib/sendbirdClient";
import { useSendbirdAuth } from "../../hooks/useSendbirdAuth";
import type { BaseMessage } from "@sendbird/chat/message";
import { useUser } from "@clerk/clerk-react";
import { TbAlignLeft } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";

const ChatPage = () => {
  // — State hooks
  const [channels, setChannels] = useState<any[]>([]);
  const [currentChannel, setCurrentChannel] = useState<any | null>(null);
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [message, setMessage] = useState("");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  
  const [channelMembers, setChannelMembers] = useState<any[]>([]);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addSelectedIds, setAddSelectedIds] = useState<string[]>([]);
  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState(""); // <-- Add this line
  
  useSendbirdAuth();
  const { user } = useUser();

  // — Load channels & users on mount
  useEffect(() => {
    fetchChannels();
    fetchAllUsers();
  }, []);

  const fetchChannels = () => {
    const q = sb.GroupChannel.createMyGroupChannelListQuery();
    q.includeEmpty = true;
    q.next((res, err) => {
      if (!err && res) setChannels(res);
    });
  };

  const fetchAllUsers = async () => {
    try {
      const users = await sb.createApplicationUserListQuery().next();
      setAllUsers(users);
    } catch (err) {
      console.error("Error fetching Sendbird users:", err);
    }
  };

  const openChannel = async (ch: any) => {
    setCurrentChannel(ch);

    // Load messages
    const msgs = await new Promise<BaseMessage[]>((res) => {
      const q = ch.createPreviousMessageListQuery();
      q.load(30, true, (m, e) => {
        if (!e) res(m);
        else res([]);
      });
    });
    setMessages(msgs);

    // Load members
    const mems = await ch.getMembers();
    setChannelMembers(mems);
  };

  const sendMessage = () => {
    if (!message.trim() || !currentChannel) return;
    const params = new sb.UserMessageParams();
    params.message = message;
    currentChannel.sendUserMessage(
      params,
      (msg: BaseMessage, err: Error | null) => {
      if (!err) {
        setMessages((prev: BaseMessage[]) => [...prev, msg]);
        setMessage("");
      }
      }
    );
  };

  const createGroupChannel = async () => {
    if (!newChannelName || selectedUserIds.length === 0) return;

    const params = new sb.GroupChannelParams();
    params.name = newChannelName;
    params.addUserIds(selectedUserIds);
    params.isDistinct = false;

    try {
      const newCh = await sb.GroupChannel.createChannel(params);
      setShowCreateModal(false);
      setNewChannelName("");
      setSelectedUserIds([]);

      fetchChannels();
      openChannel(newCh);
    } catch (err) {
      console.error("Error creating channel:", err);
    }
  };

  const deleteGroupChannel = async () => {
    if (!currentChannel) return;
    if (!confirm(`Delete channel "${currentChannel.name}"?`)) return;

    try {
      await currentChannel.delete();
      setCurrentChannel(null);
      setMessages([]);
      setChannelMembers([]);
      fetchChannels();
    } catch (err) {
      console.error("Error deleting channel:", err);
    }
  };

  const removeUser = async (uid: string) => {
    if (!currentChannel) return;
    try {
      await currentChannel.removeMembers([uid]);
      const mems = await currentChannel.getMembers();
      setChannelMembers(mems);
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setAddSearch("");
    setAddSelectedIds([]);
  };

  const handleAddSubmit = async () => {
    if (!currentChannel || addSelectedIds.length === 0) return;
    try {
      await currentChannel.inviteWithUserIds(addSelectedIds);
      const mems = await currentChannel.getMembers();
      setChannelMembers(mems);
      fetchChannels();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding users:", err);
    }
  };

  // — Filters
  const filteredCreateUsers = allUsers.filter((u) =>
    (u.primaryEmailAddress?.emailAddress || u.userId)
      .toLowerCase()
      .includes(searchEmail.toLowerCase())
  );

  const filteredAddUsers = allUsers
    .filter((u) => !channelMembers.find((m) => m.userId === u.userId))
    .filter((u) =>
      (u.primaryEmailAddress?.emailAddress || u.userId)
        .toLowerCase()
        .includes(addSearch.toLowerCase())
    );

  const filteredMembers = channelMembers.filter((m) =>
    (m.nickname || m.userId).toLowerCase().includes(memberSearch.toLowerCase())
  );

  // — UI
  return (
    <div className="flex h-[630px] text-white">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r bg-gray-800">
        <button
          className="w-full mb-2 py-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg"
          onClick={() => setShowCreateModal((prev) => !prev)}
        >
          {showCreateModal ? "Cancel" : "New Group Chat"}
        </button>

        {showCreateModal && (
          <div className="p-3 bg-black rounded-lg shadow mb-4">
            <input
              type="text"
              placeholder="Channel name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="w-full p-2 mb-2 border rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="Search by username or user ID"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full p-2 mb-2 border rounded-lg text-black"
            />
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg h-40 overflow-y-auto bg-black">
              {filteredCreateUsers.map((u) => (
                <label key={u.userId} className="flex flex-col items-center text-xs">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.userId)}
                    onChange={(e) => {
                      setSelectedUserIds((cur) =>
                        e.target.checked
                          ? [...cur, u.userId]
                          : cur.filter((id) => id !== u.userId)
                      );
                    }}
                  />
                  <img src={u.profileUrl || ""} className="w-10 h-10 rounded-full mt-1" />
                  <span>{u.nickname || u.userId}</span>
                </label>
              ))}
            </div>
            <button
              className="w-full p-2 bg-purple-600 text-white rounded-lg mt-2"
              onClick={createGroupChannel}
            >
              Create
            </button>
          </div>
        )}

        <h2 className="font-semibold mb-2">Your Chats</h2>
        <ul>
          {channels.map((ch) => (
            <li
              key={ch.url}
              className={`p-2 mb-1 rounded-lg cursor-pointer ${
                currentChannel?.url === ch.url ? "bg-purple-200 text-black" : "hover:bg-purple-400"
              }`}
              onClick={() => openChannel(ch)}
            >
              {ch.name || "Unnamed"}
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col p-4 relative bg-gray-800">
        {currentChannel ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{currentChannel.name}</h2>
              <div className="flex gap-4">
                <button
                  className="text-sm underline"
                  onClick={() => setShowMembersPanel((prev) => !prev)}
                >
                  {showMembersPanel ? <IoCloseSharp className="text-xl" /> : <TbAlignLeft className="text-xl"/>}
                </button>
              </div>
            </div>

            {showMembersPanel && (
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <div className="flex flex-wrap gap-4">
                  {filteredMembers.map((m) => (
                    <div key={m.userId} className="w-20 text-center">
                    </div>
                  ))}
                  <div className="w-full text-center flex items-center gap-3">
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs"
                      onClick={openAddModal}
                    >
                      Add Users
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs"
                    >
                      Remove Users
                    </button>
                    <button
                      className="bg-yellow-600 text-white px-2 py-1 rounded-lg text-xs"
                    >
                     View All Users
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-black rounded-lg p-6 w-96 max-h-[80%] overflow-y-auto text-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Add Users</h3>
                    <button onClick={() => setShowAddModal(false)}>X</button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by username or user ID"
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                    className="w-full p-2 mb-3 border rounded-lg text-black"
                  />
                  <div className="h-fit overflow-y-auto mb-4">
                    {filteredAddUsers.map((u) => (
                      <label key={u.userId} className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={addSelectedIds.includes(u.userId)}
                          onChange={(e) => {
                            setAddSelectedIds((cur) =>
                              e.target.checked
                                ? [...cur, u.userId]
                                : cur.filter((id) => id !== u.userId)
                            );
                          }}
                        />
                        <img src={u.profileUrl || ""} className="w-8 h-8 rounded-full" />
                        <span className="text-xs">
                          {u.nickname}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="w-full p-2 bg-black text-red-500 rounded-lg"
                  >
                    Add Users
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto border p-3 rounded-lg mb-3">
              {messages.map((msg) => (
                <div key={msg.messageId} className="mb-2">
                  {(msg as any).sender.profileUrl && (
                    <img src={(msg as any).sender.profileUrl} alt="Profile" className="w-8 h-8 rounded-full inline-block mr-2" />
                  )}
                  <span className="font-medium">
                    {"sender" in msg && (msg as any).sender
                      ? (msg as any).sender.nickname
                      : "Unknown"}
                    :
                  </span> {msg.message}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg text-black"
              />
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">Select a channel</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

