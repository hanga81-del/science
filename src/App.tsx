import React, { useState, useCallback, useRef, useEffect } from "react";

// CDN으로 Tailwind CSS 로드
const loadTailwind = () => {
  if (!document.querySelector('script[src*="tailwindcss"]')) {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }
};

// 간단한 아이콘 컴포넌트들
const Users = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="m22 21-2-2" />
    <path d="m16 16 2 2" />
    <circle cx="18" cy="13" r="3" />
  </svg>
);

const UserPlus = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const Download = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const Upload = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const Shuffle = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 3h5v5" />
    <path d="M8 17l13-13" />
    <path d="M21 14v5h-5" />
    <path d="M3 19l5-5" />
  </svg>
);

const Trash2 = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const Settings = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-3.5l-4.24 4.24M6.74 6.74l-4.24-4.24M17.5 20.5l-4.24-4.24M6.74 17.26l-4.24 4.24" />
  </svg>
);

const FileSpreadsheet = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <path d="M8 13h2" />
    <path d="M14 13h2" />
    <path d="M8 17h2" />
    <path d="M14 17h2" />
  </svg>
);

const Cloud = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

interface Group {
  id: number;
  name: string;
  members: string[];
}

const ScienceGroupMaker = () => {
  const [students, setStudents] = useState<string[]>([]);

  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: "1모둠", members: [] },
    { id: 2, name: "2모둠", members: [] },
    { id: 3, name: "3모둠", members: [] },
    { id: 4, name: "4모둠", members: [] },
  ]);

  const [draggedStudent, setDraggedStudent] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTailwind();
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, student: string) => {
    setDraggedStudent(student);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDropToGroup = useCallback(
    (e: React.DragEvent, groupId: number) => {
      e.preventDefault();
      if (!draggedStudent) return;

      setGroups((prev) =>
        prev.map((group) => {
          if (group.id === groupId && !group.members.includes(draggedStudent)) {
            return { ...group, members: [...group.members, draggedStudent] };
          }
          return group;
        })
      );

      setStudents((prev) => prev.filter((s) => s !== draggedStudent));
      setDraggedStudent(null);
    },
    [draggedStudent]
  );

  const handleDropToStudents = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedStudent) return;

      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          members: group.members.filter((member) => member !== draggedStudent),
        }))
      );

      setStudents((prev) => {
        if (!prev.includes(draggedStudent)) {
          return [...prev, draggedStudent];
        }
        return prev;
      });

      setDraggedStudent(null);
    },
    [draggedStudent]
  );

  const handleAutoAssign = useCallback(() => {
    const allStudents = [...students];
    const shuffled = [...allStudents].sort(() => Math.random() - 0.5);

    const newGroups = groups.map((group) => ({
      ...group,
      members: [] as string[],
    }));

    shuffled.forEach((student, index) => {
      const groupIndex = index % groups.length;
      newGroups[groupIndex].members.push(student);
    });

    setGroups(newGroups);
    setStudents([]);
  }, [students, groups]);

  const handlePartialAutoAssign = useCallback(() => {
    if (students.length === 0) return;

    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newGroups = [...groups];

    shuffled.forEach((student, index) => {
      const groupIndex = index % groups.length;
      newGroups[groupIndex].members.push(student);
    });

    setGroups(newGroups);
    setStudents([]);
  }, [students, groups]);

  const handleReset = useCallback(() => {
    const allMembers = groups.flatMap((group) => group.members);
    setStudents((prev) => [...prev, ...allMembers]);
    setGroups((prev) => prev.map((group) => ({ ...group, members: [] })));
  }, [groups]);

  const handleAddStudent = useCallback(() => {
    if (newStudentName.trim() && !students.includes(newStudentName.trim())) {
      setStudents((prev) => [...prev, newStudentName.trim()]);
      setNewStudentName("");
    }
  }, [newStudentName, students]);

  const handleClearStudents = useCallback(() => {
    setStudents([]);
  }, []);

  const handleGroupCountChange = useCallback(
    (count: number) => {
      if (count < groups.length) {
        const removedGroups = groups.slice(count);
        const membersToMove = removedGroups.flatMap((group) => group.members);
        setStudents((prev) => [...prev, ...membersToMove]);
        setGroups((prev) => prev.slice(0, count));
      } else {
        const newGroups = [];
        for (let i = groups.length; i < count; i++) {
          newGroups.push({ id: i + 1, name: `${i + 1}모둠`, members: [] });
        }
        setGroups((prev) => [...prev, ...newGroups]);
      }
    },
    [groups]
  );

  const handleExport = useCallback(() => {
    let csvContent = "모둠,학생명\n";
    groups.forEach((group) => {
      group.members.forEach((member) => {
        csvContent += `${group.name},${member}\n`;
      });
    });

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "과학실험모둠.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [groups]);

  const handleTextUpload = useCallback(() => {
    if (!uploadText.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    const lines = uploadText.split("\n");
    const studentNames: string[] = [];

    lines.forEach((line) => {
      const names = line
        .split(/[,\t\s]+/)
        .filter((name) => name && name.trim())
        .map((name) => name.trim());
      studentNames.push(...names);
    });

    const uniqueNames = [...new Set(studentNames)].filter((name) => name);

    if (uniqueNames.length > 0) {
      setStudents(uniqueNames);
      setShowUploadModal(false);
      setUploadText("");
    } else {
      alert("유효한 학생 이름을 찾을 수 없습니다.");
    }
  }, [uploadText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={24} />
              <h1 className="text-xl font-bold text-gray-800">
                과학실험 모둠 만들기
              </h1>
              <span className="text-sm text-gray-600 hidden sm:inline">
                드래그로 모둠 배정
              </span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1 text-xs">
                <Settings size={14} />
                <select
                  value={groups.length}
                  onChange={(e) =>
                    handleGroupCountChange(parseInt(e.target.value))
                  }
                  className="border rounded px-2 py-1 text-xs"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}모둠
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAutoAssign}
                className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
              >
                <Shuffle size={14} />
                전체배정
              </button>
              <button
                onClick={handlePartialAutoAssign}
                className="flex items-center gap-1 bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700"
                disabled={students.length === 0}
              >
                <Shuffle size={14} />
                나머지배정
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
              >
                <Upload size={14} />
                명단업로드
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
              >
                <Trash2 size={14} />
                초기화
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
              >
                <Download size={14} />
                내보내기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            <div className="bg-blue-50 rounded p-2 text-center">
              <div className="text-lg font-bold text-blue-600">
                {students.length}
              </div>
              <div className="text-xs text-gray-600">미배정</div>
            </div>
            <div className="bg-green-50 rounded p-2 text-center">
              <div className="text-lg font-bold text-green-600">
                {groups.reduce((sum, group) => sum + group.members.length, 0)}
              </div>
              <div className="text-xs text-gray-600">배정됨</div>
            </div>
            <div className="bg-purple-50 rounded p-2 text-center">
              <div className="text-lg font-bold text-purple-600">
                {groups.length}
              </div>
              <div className="text-xs text-gray-600">모둠수</div>
            </div>
            <div className="bg-orange-50 rounded p-2 text-center">
              <div className="text-lg font-bold text-orange-600">
                {Math.round(
                  (groups.reduce(
                    (sum, group) => sum + group.members.length,
                    0
                  ) /
                    groups.length) *
                    10
                ) / 10}
              </div>
              <div className="text-xs text-gray-600">평균크기</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-3">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md h-fit">
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-800">
                    학생 목록
                  </h2>
                  <button
                    onClick={handleClearStudents}
                    disabled={students.length === 0}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    title="학생 목록 초기화"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="이름 입력"
                    className="flex-1 px-2 py-1 border rounded text-xs"
                    onKeyPress={(e) => e.key === "Enter" && handleAddStudent()}
                  />
                  <button
                    onClick={handleAddStudent}
                    className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                  >
                    <UserPlus size={12} />
                  </button>
                </div>
              </div>
              <div
                className="p-2 max-h-72 overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={handleDropToStudents}
              >
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-xs">
                    모든 학생이 배정됨
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-1">
                    {students.map((student, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, student)}
                        className="bg-blue-50 border border-blue-200 rounded p-1 cursor-move hover:bg-blue-100 transition-colors text-center"
                      >
                        <span className="text-gray-800 text-xs font-medium block truncate">
                          {student}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div
              className={`grid gap-3 ${
                groups.length <= 2
                  ? "grid-cols-2"
                  : groups.length <= 4
                  ? "grid-cols-2 lg:grid-cols-4"
                  : groups.length <= 6
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-lg shadow-md">
                  <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {group.members.length}명
                    </p>
                  </div>
                  <div
                    className="p-2 min-h-[120px] max-h-60 overflow-y-auto border-2 border-dashed border-gray-200"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropToGroup(e, group.id)}
                  >
                    {group.members.length === 0 ? (
                      <div className="flex items-center justify-center h-24 text-gray-400">
                        <div className="text-center">
                          <Users size={20} />
                          <p className="text-xs">드래그 추가</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {group.members.map((member, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, member)}
                            className="bg-green-50 border border-green-200 rounded p-1 cursor-move hover:bg-green-100 transition-colors text-center"
                          >
                            <span className="text-gray-800 text-xs font-medium block truncate">
                              {member}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">학생 명단 업로드</h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Cloud size={32} />
                    <h4 className="font-medium mb-2">텍스트로 명단 입력</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      구글 시트에서 학생 명단을 복사해서 붙여넣으세요
                    </p>
                  </div>
                  <textarea
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    placeholder="학생 이름을 붙여넣으세요&#10;(예시)&#10;김민수 이영희 박지훈&#10;최서연&#10;정다은,김태현&#10;이수빈	박민재"
                    className="w-full h-32 p-3 border rounded-lg text-sm resize-none mb-3"
                  />
                  <button
                    onClick={handleTextUpload}
                    disabled={!uploadText.trim()}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    명단 적용
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScienceGroupMaker;
