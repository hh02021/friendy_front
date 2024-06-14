import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom"; 
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useState,useEffect } from "react";
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { LogingedContext } from "../../App"
import { useContext } from "react";

const LoginRegister = () => {
  let { pathname } = useLocation();

  let logingedCon =useContext(LogingedContext);
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    userPwd: "",
    userName: "",
    nickName: "",
    birth: "",
    address: "",
    email: "",
    phone: "",
    country: "",
    gender: "",
    interestCategory: []
    
  });

  const [interestOptions, setInterestOptions] = useState([]);

  const [countryOptions] = useState([
    { value: "KOREAN", label: "내국인" },
    { value: "FOREIGNER", label: "외국인" }
  ]);
  const [genderOptions] = useState([
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" }
  ]);

  const [idText,setIdText] = useState("");
  const [isCheck,setIsCheck] = useState(false);

  const [loginData, setLoginData] = useState({
    userId:"",
    userPwd:""
  });

  const [rememberMe, setRememberMe] = useState(false);

  // 로그인 데이터 입력될때마다 상태 값 수정
  const handleLoginDataChange = (e) => {
    const {name, value} = e.target;
    setLoginData({...loginData,[name]: value})
  }

  const submitLogin = (e) =>{
    e.preventDefault();//submit이벤트 막음 

    let formData = new FormData(); //폼전송으로 보내기위한 작업 
    formData.append("userId", loginData.userId); 
    formData.append("userPwd", loginData.userPwd);

    axios({
      method:"POST", 
      url : "http://localhost:9000/login", 
      data : formData, 
      }) 
      .then((res)=>{ 

       // 인증된 사용자의 정보를 저장
       localStorage.setItem("userId", res.data.userId); 
       localStorage.setItem("userName", res.data.userName);
       localStorage.setItem("userSeq", res.data.userSeq); 
       localStorage.setItem("Authorization", res.headers.authorization);

       if (rememberMe){
        localStorage.setItem("rememberedUserId",  loginData.userId);
        localStorage.setItem("rememberedPassword",  loginData.userPwd);
       }else{
        localStorage.removeItem("rememberedUserId");
        localStorage.removeItem("rememberedPassword");
       }
       logingedCon.onLoggedChange(true);

       navigator("/");
     }) 
      .catch((err)=>{ 
      alert("정보를 다시 확인해주세요."); 
      setLoginData({ 
        userId :"" , 
        userPwd:""})
     });

  }



  // 관심사 카테고리 뿌려주기
  useEffect(() => {

    const rememberedUserId = localStorage.getItem("rememberedUserId");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedUserId && rememberedPassword) {
      setLoginData({
        userId : rememberedUserId,
        userPwd : rememberedPassword
      })
      setRememberMe(true);
    }

    axios.get("http://localhost:9000/interest/")
      .then((res) => {
        const options = res.data.map(interest => ({
          value: interest.interestSeq,
          label: interest.interestCategory
        }));
        setInterestOptions(options);
      })
      .catch((err) => {
        let errMessage = err.response.data.type + "\n" + 
        err.response.data.title + "\n" + 
        err.response.data.detail + "\n" + 
        err.response.data.status + "\n" + 
        err.response.data.instance + "\n" + 
        err.response.data.timestamp; 
        console.log(errMessage);
      });
  },[]);

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    console.log(name.value)
    console.log(selectedOption)
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : ""
    });
    console.log(formData);
  };

  const handleInterestChange = (selectedOptions) => {
    const interests = selectedOptions ? selectedOptions.map(option => option.label) : [];
    console.log(selectedOptions)
    setFormData({
      ...formData,
      interestCategory: interests
    });
    console.log(formData);
  };

  const handleCheckboxChange = (e) => {
    console.log(e.target.checked);
    setRememberMe(e.target.checked);
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name)
    if( name==="userId" && value!==""){ 
      axios({ 
          method:"POST", 
          url : "http://localhost:9000/users/"+value,
      }) 
      .then((res)=>{ 
        setIsCheck(res.data)
        res.data === false ? setIdText("사용가능한 ID입니다") : setIdText("중복된 ID입니다");
        console.log(res.data)
      })
      .catch((err)=>{ //실패 
          let errMessage = err.response.data.type +"\n"; 
          errMessage += err.response.data.title +"\n"; 
          errMessage += err.response.data.detail +"\n";
          errMessage += err.response.data.status +"\n"; 
          errMessage += err.response.data.instance +"\n"; 
          errMessage += err.response.data.timestamp; 
          alert(errMessage); }); 
      }

    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 데이터를 서버로 전송해서 가입하는 로직 작성
   // 에러 메시지 초기화
   let errorMessage = "";

   // 필드 검증
   if (!formData.userId) {
     errorMessage = "아이디를 입력해주세요.";
   } else if (formData.userPwd === "") {
     errorMessage = "비밀번호를 입력해주세요.";
   } else if (formData.userName === "") {
    errorMessage = "이름을 입력해주세요.";
  } else if (formData.nickName === "") {
    errorMessage =  "닉네임을 입력해주세요.";
  }else if (formData.birth === "") {
    errorMessage = "생일을 입력해주세요.";
  } else if (formData.address === "") {
    errorMessage = "주소를 입력해주세요.";
  }else if (formData.email === "") {
    errorMessage = "이메일을 입력해주세요.";
  } else if (formData.phone === "") {
    errorMessage = "전화번호를 입력해주세요.";
  }else if (formData.country === "") {
    errorMessage = "국적을 입력해주세요.";
  } else if (formData.gender === "") {
    errorMessage = "성별을 입력해주세요.";
  }else if (formData.interestList === "") {
    errorMessage = "관심사를 선택해주세요.";
  }
   
   if (errorMessage !=="") {
     alert(errorMessage);
     return;
   }
   // 전송
   axios({ 
    method:"POST", 
    url : "http://localhost:9000/users/join",
    data : formData, 
    }) 
     .then((res)=>{ 
        alert(res.data); 
        navigator("/emailVerification"); 
    }) 
    .catch((err)=>{ console.log(err) 
        let errMessage = err.response.data.type +"\n"; 
        errMessage += err.response.data.title +"\n"; 
        errMessage += err.response.data.detail +"\n"; 
        errMessage += err.response.data.status +"\n"; 
        errMessage += err.response.data.instance +"\n"; 
        
        errMessage += err.response.data.timestamp; 
        alert(errMessage); 
    });

    console.log(formData);
  };



  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Login Register", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={submitLogin}>
                              <input
                                type="text"
                                name="userId"
                                placeholder="ID"
                                value={loginData.userId}
                                onChange={handleLoginDataChange}
                              />
                              <input
                                type="password"
                                name="userPwd"
                                placeholder="Password"
                                value={loginData.userPwd}
                                onChange={handleLoginDataChange}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox"
                                  checked={rememberMe} 
                                  onChange={handleCheckboxChange}
                                   />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/findPassword"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button type="submit">
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit = {handleSubmit}>
                              {<span style={ isCheck ? {color:'red'} : {color:'blue'}}>{idText}</span>}
                              <input
                                type="text"
                                name="userId"
                                placeholder="ID"
                                onChange={handleInputChange}
                              />
                              <input
                                type="password"
                                name="userPwd"
                                placeholder="Password"
                                onChange={handleInputChange}
                              />
                              <input
                                type="text"
                                name="userName"
                                placeholder="이름"
                                onChange={handleInputChange}
                              />
                                <input
                                type="text"
                                name="nickName"
                                placeholder="닉네임"
                                onChange={handleInputChange}
                              />
                              <input
                                type="text"
                                name="birth"
                                placeholder="생년월일8글자 ex)19980210 "
                                onChange={handleInputChange}
                              />
                              <input
                                type="text"
                                name="address"
                                placeholder="주소"
                                onChange={handleInputChange}
                              />
                              <input
                                name="email"
                                placeholder="이메일"
                                type="email"
                                onChange={handleInputChange}
                              />
                               <input
                                type="text"
                                name="phone"
                                placeholder="(-)제거 ex)01012345678"
                                onChange={handleInputChange}
                              />
                              <br></br>
                              <label>국적</label>
                              <Select
                                name="country"
                                options={countryOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={handleSelectChange}
                                value={countryOptions.find(option => option.value === formData.country) || ""}
                              />
                              <br></br>
                              <label>성별</label>
                              <Select
                                name="gender"
                                options={genderOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={handleSelectChange}
                                value={genderOptions.find(option => option.value === formData.gender) || ""}
                              />
                              <br></br>
                              <label>관심사</label>
                              <Select
                                isMulti
                                name="interestCategory"
                                options={interestOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleInterestChange}
                                value={interestOptions.filter(option => formData.interestCategory.includes(option.label))}
                              />
                              <br></br>
                              <div className="button-box">
                                <button type="submit">
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
