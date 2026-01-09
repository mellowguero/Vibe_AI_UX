import ListItem from "../components/ListItem";
import Modal from "../components/Modal";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import Auth from "../components/Auth";

import { ReactComponent as Search } from "../assets/images/search.svg";

import { getUserTasks } from "../services/taskApi";
import { getUserDetails } from "../services/userApi";
import { useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Footer from "../components/Footer";

function App() {
	const { user } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");

	const [tasks, setTasks] = useState([]);
	const [selectedTask, setSelectedTask] = useState(null);
	const [userDetails, setUserDetails] = useState(null);

	const openModal = (task) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	const fetchTasks = async () => {
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/1e5aa359-db93-455b-8285-ac7b5edaefa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:34',message:'fetchTasks called',data:{user:user,userUsername:user?.username,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
		// #endregion
		if (!user || !user.username) {
			console.error('User not available');
			return;
		}
		await getUserTasks(user.username).then((res) => {
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/1e5aa359-db93-455b-8285-ac7b5edaefa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:35',message:'getUserTasks response',data:{res:res,resType:Array.isArray(res)?'array':typeof res,resLength:Array.isArray(res)?res.length:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
			// #endregion
			setTasks(res);
			setIsLoading(false);
		});
	};

	const fetchUserDetails = async () => {
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/1e5aa359-db93-455b-8285-ac7b5edaefa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:41',message:'fetchUserDetails called',data:{user:user,userUsername:user?.username,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
		// #endregion
		if (!user || !user.username) {
			console.error('User not available');
			return;
		}
        await getUserDetails(user.username).then((res) => {
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/1e5aa359-db93-455b-8285-ac7b5edaefa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:42',message:'getUserDetails response',data:{res:res,resType:Array.isArray(res)?'array':typeof res,hasErr:res?.err},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
			// #endregion
            setUserDetails(res);
            setIsLoading(false);
        });
    };

	useEffect(() => {
		if(user) {
			fetchTasks();
			fetchUserDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const filterBySearch = (tasks, searchWord) => {
		if (searchWord === "") {
			return tasks;
		}

		return tasks.filter((task) => {
			return task?.title?.toLowerCase().includes(searchWord.toLowerCase());
		});
	};

	const filterByUrgency = (tasks, filter) => {
		if (filter === "all") {
			return tasks;
		} else {
			return tasks.filter((task) => {
				return task?.urgency?.toLowerCase() === filter.toLowerCase();
			});
		}
	};

	const resetFilter = () => {
		setSearch("");
		setFilter("all");
		const defaultOption = document.getElementById("defaultTaskOption");
		const searchInput = document.getElementById("searchTaskInput");
		if (defaultOption) defaultOption.selected = true;
		if (searchInput) searchInput.value = "";
	};

	const pendingTasks = tasks.filter((task, index) => {
		return task && !task.completed;
	});

	const completedTasks = tasks.filter((task, index) => {
		return task && task.completed;
	});

	const sortedTasks = pendingTasks.sort((a, b) => {
		if (!a || !b) return 0;
		return (a.id || 0) - (b.id || 0);
	});
		
	return (
		<>
			<div className='main'>
				<div className='gradient'/>
			</div>

			{!user ? <Auth /> : (
				<main className="app">
					<Navigation fetchTasks={fetchTasks}/>
					{isLoading && <Loading />}

					<div className="flex flex-col gap-5 w-full">
						<h2 className="text-xl md:text-3xl font-bold pb-5 border-dotted border-gray-700 border-b-2 text-center">Hello, {userDetails?.first_name} 👋</h2>

						{
						pendingTasks.length > 0 ? 
							(
								<>
									<p className="text-center text-gray-500">You have {pendingTasks.length} pending tasks.</p>


									<div className="w-full md:w-2/3 mx-auto shadow p-5 rounded-lg bg-white">
										<div className="relative">
											<div className="absolute flex items-center ml-2 h-full">
												<Search className="w-4 h-4 fill-current text-primary-gray-dark" />
											</div>

											<input 
												onChange={(e) => {
													setFilter("all");
													const defaultOption = document.getElementById("defaultTaskOption");
													if (defaultOption) defaultOption.selected = true;
													setSearch(e.target.value);
												}}
												id="searchTaskInput"
												type="text" 
												placeholder="Search by task title..." className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" />
										</div>

										<div className="flex items-center justify-between mt-4">
											<div>
												<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
													<select 
														onChange={(e) => {
															setFilter(e.target.value);
														}}
														className="px-4 py-3 w-full rounded-md bg-white border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
															<option value="all" id="defaultTaskOption">All Tasks</option>
															<option value="casual">Casual</option>
															<option value="urgent">Urgent</option>
															<option value="important">Important</option>
													</select>
												</div>
											</div>

											<button 
												onClick={resetFilter}
												className="w-fit px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 text-sm font-medium rounded-md">
												Reset
											</button>
										</div>

										
									</div>	
									
									<div className="container">
										{filterBySearch(filterByUrgency(sortedTasks, filter), search).map((task) => {
											return (
												<ListItem key={task.id} task={task} fetchTasks={fetchTasks} openModal={openModal} />
											);
										})}
									</div>
								</>
							)
							: 
							(
								<div className="flex flex-col items-center gap-5">
									<p className="text-center text-gray-500">You have no tasks yet. Create one by clicking the button below!</p>
									<button
										onClick={() => {
											setIsModalOpen(true);
										}}
										className="button button-primary">
										<span className="button-body">
											<span className="button-text">Create Task</span>
										</span>
									</button>
								</div>
							)
						}
					</div>

					<div className="container mt-20 opacity-30">
						<div>
							<h2 className="text-base md:text-lg font-bold pb-5 text-center">Compeleted Tasks</h2>
						</div>
						{completedTasks.map((task) => {
							return (
								<ListItem key={task.id} task={task} fetchTasks={fetchTasks} openModal={openModal} />
							);
						})}
					</div>

					{(isModalOpen && pendingTasks.length < 1) && (<Modal mode="create" setIsModalOpen={setIsModalOpen} fetchTasks={fetchTasks}/>)}
					{(isModalOpen && tasks.length > 0 && selectedTask) && (<Modal setIsModalOpen={setIsModalOpen} mode={'edit'} task={selectedTask} fetchTasks={fetchTasks} />)}
				</main>
			)}
			<Footer />
		</>
		
	);
}

export default App;
