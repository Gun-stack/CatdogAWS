import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import SwalCustomAlert from '../../Alerts/SwalCustomAlert';
import { url } from '../../../config';


function UserReviewList() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const reservationList = useSelector((state) => state.resvList);
    const resvList = reservationList.filter((resv) => resv.status === "완료");
    const token = useSelector(state => state.token);
    const navigate = useNavigate();



    useEffect(() => {
        console.log(reservationList)

        // console.log("로그인 후 토큰 값 : " + token);
        axios.get(`${url}/user`, {
            headers: {
                Authorization: token,
            }
        })
            .then(res => {
                console.log("Res : " + res.data);
            })
            .catch(err => {
                // console.log("Err : " + err);
                SwalCustomAlert(
                    'warning',
                    "로그인 이후 사용 가능합니다."
                );
                navigate('/userlogin');
            })

        axios.get(`${url}/resinfobyuserid?userId=${user.id}`)
            .then((res) => {
                if (res.data !== undefined) {
                    dispatch({ type: 'SET_RESV_LIST', payload: res.data });
                    console.log(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [user.id]);
    return (
        <main className="cd-main dis-center">
            <section className="shop-main-section bg-white">
                <ul className="nav-ul">
                    <li className="nav-li">
                        <Link to={`/usermy/reservationdone/${user.num}`}>
                            <div>
                                <i className="fas fa-caret-square-right mypage-arrow"></i>이용 완료 내역보기
                            </div>
                        </Link>
                        <i className="fas fa-store"></i>
                    </li>
                </ul>

                {resvList.length === 0 ? (
                    <div action="" className="shop-form-container">
                        <div className="input-img-click sm-input-img">
                            <p>이전 이용 내역이 없습니다</p>
                        </div>
                    </div>
                ) :
                    (
                        <div>
                            {/* 최근 방문순서? */}
                            {resvList.reverse().map((resv, index) => (
                                <div key={index} className="reservation-list-container">
                                    <hr className="divide-line" />
                                    <div className="re-shop-info">
                                        <span className="re-shop-name"><span className="re-text">샵 이름 :</span> {resv.shopName}</span>
                                        <span className="re-pet-name"><span className="re-text">반려동물 이름 :</span>{resv.petName}</span>
                                    </div>
                                    <div className="re-date">
                                        {resv.date}  , {(resv.time).slice(0, -3)}시
                                    </div>
                                    <div className="re-btns">
                                        <span className="is-visit">
                                            {resv.status === "예약" ? '방문 예정' : '방문 완료'}
                                        </span>
                                        <span className="is-visit">
                                            {resv.status === "완료" && resv.isReview === 0 ?
                                                (<Link to={`/usermy/reviewregform/${resv.num}`}><button className="small-btn btn-text">리뷰 쓰기</button></Link>)
                                                : (<Link to={`/usermy/reviewdetail/${resv.num}`}><button className="small-btn btn-text">리뷰보기</button></Link>)}
                                        </span>
                                        <Link to={`/usermy/check/${resv.num}`}>
                                            <button className="small-btn btn-text">
                                                예약확인
                                            </button>
                                        </Link>
                                    </div>
                                    <hr className="divide-line" />
                                </div>
                            ))}
                        </div>
                    )}
            </section>
        </main>
    );
}

export default UserReviewList;