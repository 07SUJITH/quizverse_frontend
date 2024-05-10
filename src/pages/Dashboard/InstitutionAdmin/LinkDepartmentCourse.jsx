import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { axiosPrivate } from "../../../config/axiosInstance";

const LinkDepartmentCourse = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [linkedDeps, setLinkedDeps] = useState([]);
  const [linkedCourse, setLinkedCourse] = useState([]);
  const [searchData, setSearchData] = useState({
    linkedCourse: "",
    linkedDeps: "",
    courseList: "",
    departmentList: "",
  });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDepatments, setSelectedDepatments] = useState([]);
  useEffect(() => {
    console.log(selectedCourses);
  }, [selectedCourses]);

  const linkCourse = async () => {
    if (selectedCourses.length > 0) {
      try {
        const response = await axiosPrivate.post(
          "/admin/link/institution-course/",
          selectedCourses
        );
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else {
      toast.error("please select the courses");
    }
  };

  const linkDepartments = async () => {
    if (selectedCourses.length > 0) {
      try {
        const response = await axiosPrivate.post(
          "/admin/link/institution-department/",
          selectedCourses
        );
        console.log(response.data);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else {
      toast.error("please select the Departments");
    }
  };

  const handleInputChange = (event, option) => {
    setSearchData((prevState) => ({
      ...prevState,
      [option]: event.target.value,
    }));
  };

  // call the searching when user click the enter key
  const handleKeyPress = (event, option) => {
    if (event.key === "Enter") {
      handleSearchIconClick(option);
    }
  };
  // handle searching of 4 possible search in a single function.
  const handleSearchIconClick = (option) => {
    const optionMap = {
      linkedCourse: {
        apiEndpoint: "/admin/course?status=linked",
        stateSetter: setLinkedCourse,
        fetchFunc: fetchLinkedCourse,
      },
      linkedDeps: {
        apiEndpoint: "/admin/course?status=unlinked",
        stateSetter: setLinkedDeps,
        fetchFunc: fetchLinkedDepartment,
      },
      courseList: {
        apiEndpoint: "/admin/department?status=linked",
        stateSetter: setCourseList,
        fetchFunc: fetchCourse,
      },
      departmentList: {
        apiEndpoint: "/admin/department?status=unlinked",
        stateSetter: setDepartmentList,
        fetchFunc: fetchDepartmnet,
      },
    };
    const searchItem = async (search) => {
      try {
        const response = await axiosPrivate.get(
          `${optionMap[option].apiEndpoint}?search=${search}`
        );
        optionMap[option].stateSetter(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Item not found");
      }
    };

    if (searchData[option] !== "") {
      searchItem(searchData[option]);
    } else {
      optionMap[option].fetchFunc();
    }
  };
  //datas which are connected to institution
  //fetch your courses - courses which are connected to the institution
  const fetchLinkedCourse = async () => {
    try {
      // add linkerd course api
      const response = await axiosPrivate.get("/admin/course?status=linked");
      setLinkedCourse(response.data);
    } catch (error) {
      setLinkedCourse([]);
    }
  };
  useEffect(() => {
    fetchLinkedCourse();
  }, []);
  //fetch your departments  which are connected to the institution
  const fetchLinkedDepartment = async () => {
    try {
      // add linked department  api
      const response = await axiosPrivate.get("/admin/department?status=linked");
      setLinkedDeps(response.data);
    } catch (error) {
      setLinkedDeps([]);
    }
  };
  useEffect(() => {
    fetchLinkedDepartment();
  }, []);
  //datas which are not linked
  // fetch all courses that are not linked
  const fetchCourse = async () => {
    try {
      // add  unlinked course api
      const response = await axiosPrivate.get("/admin/course?status=unlinked");
      setCourseList(response.data);
    } catch (error) {
      setCourseList([]);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, []);
  // fetch all departments that are not llinked
  const fetchDepartmnet = async () => {
    try {
      // add unlinked department  api
      const response = await axiosPrivate.get("/admin/department?status=unlinked");
      setDepartmentList(response.data);
    } catch (error) {
      setDepartmentList([]);
    }
  };
  useEffect(() => {
    fetchDepartmnet();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {/* your course and department */}
      <div className="grid grid-cols-2 gap-3">
        {/* your courses  */}
        <div className="w-80">
          <div className="searchBar">
            <h1 className="text-xl font-bold mb-2 ml-1">Your Courses</h1>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                value={searchData.linkedCourse}
                onChange={(event) => handleInputChange(event, "linkedCourse")}
                onKeyDown={(event) => handleKeyPress(event, "linkedCourse")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 cursor-pointer"
                onClick={() => handleSearchIconClick("linkedCourse")}
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <div className="w-80 h-64 overflow-y-auto no-scrollbar overflow-x-visible">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {linkedCourse.map((course) => (
                  <tr key={course.id}>
                    <td>{course.username}</td>
                    <td>{course.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* your department */}
        <div className="w-80">
          <div className="searchBar">
            <h1 className="text-xl font-bold mb-2 ml-1">Your Departments</h1>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search Department.."
                value={searchData.linkedDeps}
                onChange={(event) => handleInputChange(event, "linkedDeps")}
                onKeyDown={(event) => handleKeyPress(event, "linkedDeps")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 cursor-pointer"
                onClick={() => handleSearchIconClick("linkedDeps")}
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <div className="w-80 h-64 overflow-y-auto no-scrollbar overflow-x-hidden ">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Code</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {linkedDeps.map((department) => (
                  <tr key={department.id}>
                    <td>{department.username}</td>
                    <td>{department.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <hr className="border-purple-300 border-t-2" />
      <div className="grid grid-cols-2 gap-3">
        {/* unlinked courses  */}
        <div className="w-80">
          <div className="searchBar">
            <h1 className="text-xl font-bold mb-2 ml-1">Available Courses</h1>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                value={searchData.courseList}
                onChange={(event) => handleInputChange(event, "courseList")}
                onKeyDown={(event) => handleKeyPress(event, "courseList")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 cursor-pointer"
                onClick={() => handleSearchIconClick("courseList")}
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <div className="w-80 h-96 overflow-y-auto no-scrollbar overflow-x-visible ">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {courseList.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => {
                          if (selectedCourses.includes(user.id)) {
                            setSelectedCourses([
                              selectedCourses.filter((id) => id !== user.id),
                            ]);
                          } else {
                            setSelectedCourses([...selectedCourses, user.id]);
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-80 flex p-6">
            <button
              className="btn btn-neutral w-40 mx-auto "
              onClick={linkCourse}
            >
              Link Course
            </button>
          </div>
        </div>
        {/* unlinked department */}
        <div className="">
          <div className="w-80 ">
            <div className="searchBar">
              <h1 className="text-xl font-bold mb-2 ml-1">
                Available Departments
              </h1>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  value={searchData.departmentList}
                  onChange={(event) =>
                    handleInputChange(event, "departmentList")
                  }
                  onKeyDown={(event) => handleKeyPress(event, "departmentList")}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70 cursor-pointer"
                  onClick={() => handleSearchIconClick("departmentList")}
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            <div className="w-80 h-96 overflow-y-auto no-scrollbar overflow-x-visible">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                
                <tbody>
                  {departmentList.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => {
                            if (selectedDepatments.includes(user.id)) {
                              setSelectedDepatments([
                                selectedDepatments.filter(
                                  (id) => id !== user.id
                                ),
                              ]);
                            } else {
                              setSelectedDepatments([
                                ...selectedDepatments,
                                user.id,
                              ]);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-80 flex p-6">
              <button
                className="btn btn-neutral w-40 mx-auto "
                onClick={linkDepartments}
              >
                Link Departments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LinkDepartmentCourse;
