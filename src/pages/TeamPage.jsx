import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Sidebar from "../components/Sidebar";

export default function TeamPage() {
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [teams, setTeams] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchTeams = async () => {
    const q = query(collection(db, "teams"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeams(list);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const createTeam = async () => {
    if (!teamName) return alert("Enter team name");
    await addDoc(collection(db, "teams"), {
      name: teamName,
      createdBy: user.uid,
      members: [user.uid],
      createdAt: serverTimestamp()
    });
    setTeamName("");
    fetchTeams();
  };

  const joinTeam = async () => {
    if (!joinCode) return alert("Enter valid team ID");
    const teamRef = collection(db, "teams");
    const q = query(teamRef, where("__name__", "==", joinCode));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const teamDoc = snapshot.docs[0];
      const teamData = teamDoc.data();

      if (!teamData.members.includes(user.uid)) {
        const updatedMembers = [...teamData.members, user.uid];
        await teamDoc.ref.update({ members: updatedMembers });
      }
      alert("Joined team!");
    } else {
      alert("Team not found");
    }
    setJoinCode("");
    fetchTeams();
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6 space-y-8">
        <h1 className="text-3xl font-bold">Team Management</h1>

        <div className="bg-white p-6 rounded-lg shadow space-y-4 max-w-lg">
          <h2 className="text-xl font-semibold">Create Team</h2>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={createTeam}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4 max-w-lg">
          <h2 className="text-xl font-semibold">Join Team</h2>
          <input
            type="text"
            placeholder="Enter Team ID"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={joinTeam}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Join
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">All Teams</h2>
          <ul className="space-y-2">
            {teams.map((team) => (
              <li
                key={team.id}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <div>
                  <strong>{team.name}</strong>
                  <p className="text-sm text-gray-500">ID: {team.id}</p>
                </div>
                {team.createdBy === user.uid && (
                  <span className="text-xs text-blue-600">You created</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
