import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import { Link } from 'react-router-dom';

const EventList = () => {
  
    //이벤트 전체 검색 (등록순)
    const [events, setEvents] = useState([
    
    ]);

    useEffect(() => {
      //이벤트 전체 검색 (등록순)
      axios({ 
        method:"GET", 
        url : "http://localhost:9000/event/eventlist",
        headers: {
          "Content-Type": "application/json"
        }
        }) 
         .then((res)=>{
            console.log(res)
            setEvents(res.data); 
            console.log(events)
        }) 
        .catch((err)=>{ 
          console(err)
          alert(err.response.data.title ); 
        });
      console.log(events);

      // 데드라인



  }, []);


  const getMainImg = (imgName) => {
        return imgName ? "http://localhost:9000/admin/event/main/img?imgName=" + imgName : defaultProfileImage;
};


    return (
        <div>
        <ul>
          {events.map((event) => (
            <li key={event.eventSeq} className="event-item">
            <div className="event-name" style={{fontSize: "30px"}}>
              {event.eventName} 
            </div>      
            { <Link to={`/event/${event.eventSeq}`}>
            <img src={getMainImg(event.eventMainImgName)} alt="" className="event-image" style={{marginTop: "5px"}}/>
            </Link> }
             
            {/* <img src={getMainImg(event.eventMainImgName)} alt="" className="event-image" style={{marginTop: "5px"}}/> */}
            
            <div className="event-reg-date">{event.eventRegDate}</div>
            <br></br>
            <br></br>
          </li>
          ))}
        </ul>

        </div>
    );
};

export default EventList;