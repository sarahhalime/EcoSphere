import { useEffect, useState } from "react";
import { sb } from "../../lib/sendbirdClient";
import { useSendbirdAuth } from "../../hooks/useSendbirdAuth";
import type { BaseMessage } from "@sendbird/chat/message";
import { useUser } from "@clerk/clerk-react";
import { TbAlignLeft } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";

const ChatPage = () => {
  useSendbirdAuth();


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



const [showRemoveModal, setShowRemoveModal] = useState(false);
const [removeSearch, setRemoveSearch] = useState("");
const [removeSelectedIds, setRemoveSelectedIds] = useState<string[]>([]);

const [showAllUsersModal, setShowAllUsersModal] = useState(false);


  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState(""); // <-- Add this line


  const { user } = useUser();

  const waitForConnection = async () => {
  const maxTries = 20;
  let tries = 0;

  while (!(sb as any)._isConnected && tries < maxTries) {
    await new Promise((res) => setTimeout(res, 200));
    tries++;
  }

  if (!(sb as any)._isConnected) {
    throw new Error("Sendbird not connected after waiting");
  }
};

useEffect(() => {
  (async () => {
    try {
      await waitForConnection();
      fetchChannels();
      fetchAllUsers();
    } catch (err) {
      console.error("Connection timeout:", err);
    }
  })();
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

  // const openChannel = async (ch: any) => {
  //   setCurrentChannel(ch);

  //   // Load messages
  //   const msgs = await new Promise<BaseMessage[]>((res) => {
  //     const q = ch.createPreviousMessageListQuery();
  //     q.load(30, true, (m: BaseMessage[], e: Error | null) => {
  //       if (!e) res(m);
  //       else res([]);
  //     });
  //   });
  //   setMessages(msgs);

  //   // Load members
  //   const mems = await ch.getMembers();
  //   setChannelMembers(mems);
  // };

  const openChannel = async (ch: any) => {
  try {
    const fullChannel = await sb.GroupChannel.getChannel(ch.url); // fetch full channel object
    setCurrentChannel(fullChannel);

    // Load messages
    const q = fullChannel.createPreviousMessageListQuery();
    let msgs: any[] = [];
    try {
      msgs = await q.load(30, true);
    } catch (e) {
      msgs = [];
    }
    setMessages(msgs);

    // Load members
    const mems = fullChannel.members; // use the members property
    setChannelMembers(mems);
  } catch (err) {
    console.error("Error opening channel:", err);
  }
};

const handleAddUsers = async () => {
  if (!currentChannel || addSelectedIds.length === 0) return;

  try {
    await currentChannel.inviteWithUserIds(addSelectedIds);
    const updatedChannel = await sb.GroupChannel.getChannel(currentChannel.url);
    setChannelMembers(updatedChannel.members);
    setShowAddModal(false);
  } catch (err) {
    console.error("Failed to add users:", err);
  }
};



const openRemoveModal = () => {
  setShowRemoveModal(true);
  setRemoveSearch("");
  setRemoveSelectedIds([]);
};

// const handleRemoveUsers = async (userId: string) => {
//   if (!currentChannel) return;

//   try {
//     await currentChannel.kickUserWithUserId(userId); // ✅ Use this for SDK v4
//     const updatedChannel = await sb.GroupChannel.getChannel(currentChannel.url);
//     setChannelMembers(updatedChannel.members);
//   } catch (err) {
//     console.error("Failed to remove users:", err);
//   }
// };

const handleDeleteChannel = async () => {
  if (!currentChannel) return;

  const confirmed = window.confirm("Are you sure you want to delete this group?");
  if (!confirmed) return;
};



const openAllUsersModal = () => {
  setShowAllUsersModal(true);
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


  const openAddModal = () => {
    setShowAddModal(true);
    setAddSearch("");
    setAddSelectedIds([]);
  };

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
                      onClick={openRemoveModal}
                    >
                      Remove Users
                    </button>
                    <button
                      className="bg-yellow-600 text-white px-2 py-1 rounded-lg text-xs"
                      onClick={openAllUsersModal}
                    >
                     View All Members
                    </button>
                    <button
                      className="bg-red-700 text-white px-3 py-1 rounded-lg text-xs"
                      onClick={handleDeleteChannel}
                    >
                      Delete Group
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
                    <button onClick={() => setShowAddModal(false)}><IoCloseSharp className="text-xl"/></button>
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
                    onClick={handleAddUsers}
                  >
                    Add Users
                  </button>
                </div>
              </div>
            )}

            {showRemoveModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-black rounded-lg p-6 w-96 max-h-[80%] overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Remove Users</h3>
        <button onClick={() => setShowRemoveModal(false)}><IoCloseSharp className="text-xl"/></button>
      </div>
      <input
        type="text"
        placeholder="Search members"
        value={removeSearch}
        onChange={(e) => setRemoveSearch(e.target.value)}
        className="w-full p-2 mb-3 border rounded-lg text-black"
      />
      <div className="h-fit overflow-y-auto mb-4">
        {channelMembers
          .filter((m) =>
            (m.nickname || m.userId).toLowerCase().includes(removeSearch.toLowerCase())
          )
          .map((m) => (
            <label key={m.userId} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={removeSelectedIds.includes(m.userId)}
                onChange={(e) => {
                  setRemoveSelectedIds((cur) =>
                    e.target.checked
                      ? [...cur, m.userId]
                      : cur.filter((id) => id !== m.userId)
                  );
                }}
              />
              <img src={m.profileUrl || ""} className="w-8 h-8 rounded-full" />
              <span className="text-xs">{m.nickname}</span>
            </label>
          ))}
      </div>
      <button
        className="w-full p-2 bg-black text-red-500 rounded-lg"
        // onClick={async () => {
        //   for (const userId of removeSelectedIds) {
        //     await handleRemoveUsers(userId);
        //   }
        //   setShowRemoveModal(false);
        //   setRemoveSelectedIds([]);
        // }}
      >
        Remove Selected
      </button>
    </div>
  </div>
)}

{showAllUsersModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-black rounded-lg p-6 w-96 max-h-[80%] overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Group Members</h3>
        <button onClick={() => setShowAllUsersModal(false)}><IoCloseSharp className="text-xl"/></button>
      </div>
      <div className="space-y-3">
        {channelMembers.map((m) => (
          <div key={m.userId} className="flex items-center gap-3">
            <img src={m.profileUrl || ""} className="w-8 h-8 rounded-full" />
            <span>{m.nickname}</span>
          </div>
        ))}
      </div>
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

