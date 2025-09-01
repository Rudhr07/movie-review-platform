import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { userService } from '../services/userService';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  let wishlist = useSelector(state => state.user?.wishlist);
  if (!Array.isArray(wishlist)) {
    if (wishlist && Array.isArray(wishlist.watchlist)) {
      wishlist = wishlist.watchlist;
    } else {
      wishlist = [];
    }
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
  dispatch(logout());
  navigate('/');
  };


  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || removingId) return;
    try {
      setRemovingId(movieId);
      await userService.removeFromWatchlist(user._id || user.id, movieId);
      // Optimistic update: filter out locally
      const next = wishlist.filter(m => (m._id || m.id) !== movieId);
      dispatch({ type: 'user/setWishlist', payload: next });
    } catch (err) {
      console.error('Remove watchlist error', err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
  <Link to="/" className="brand-logo" aria-label="MovieBuzzCheck home">
  <img src="/logo.svg.png" alt="MovieBuzzCheck" height="44" width="44" loading="lazy" style={{borderRadius:'12px'}} />
  <span style={{fontSize:'1.35rem'}}>MovieBuzzCheck</span>
  </Link>
  <nav aria-label="primary" />
        <div className="nav-actions" style={{display:'flex',alignItems:'center',gap:'.9rem'}}>
          <Link to="/movies" className="nav-link" style={{fontSize:'.75rem',fontWeight:600,letterSpacing:'.5px',textTransform:'uppercase',color:'var(--text-soft)'}}>Find Movie</Link>
          {user ? (
            <div className="profile" style={{ position:'relative' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowProfileMenu(p=>!p)}
                aria-haspopup="true"
                aria-expanded={showProfileMenu}
                aria-label="Profile menu"
              >{user.username.charAt(0).toUpperCase()}</button>
              {showProfileMenu && (
                <div className="profile-menu" style={{position:'absolute',top:'115%',right:0,background:'#fff',border:'1px solid var(--border-soft)',borderRadius:12,minWidth:250,maxWidth:300,boxShadow:'var(--shadow)',padding:'.85rem .9rem .95rem',animation:'var(--fade-in)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.85rem'}}>
                    <div style={{width:42,height:42,borderRadius:'50%',background:'var(--accent-soft)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:'1rem'}}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span style={{fontSize:'.7rem',letterSpacing:'.65px',textTransform:'uppercase',fontWeight:600,color:'var(--text-soft)'}}>Welcome</span>
                      <span style={{fontWeight:600,fontSize:'.9rem',letterSpacing:'.3px'}}>{user.username}</span>
                    </div>
                  </div>
                  <div style={{borderTop:'1px solid var(--border-soft)',margin:'0 0 .75rem'}} />
                  <div style={{maxHeight:180,overflowY:'auto',paddingRight:4}}>
                    {wishlist.length === 0 ? (
                      <div style={{fontSize:'.7rem',color:'var(--text-soft)',padding:'.4rem 0'}}>No wishlist items</div>
                    ) : (
                      <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:'.45rem'}}>
                        {wishlist.slice(0,8).map(item => {
                          const id = item._id || item.id;
                          return (
                            <li key={id} style={{display:'flex',alignItems:'center',gap:'.4rem'}}>
                              <Link
                                to={`/movies/${id}`}
                                onClick={()=>setShowProfileMenu(false)}
                                style={{flex:1,display:'block',textDecoration:'none',fontSize:'.72rem',fontWeight:500,color:'var(--accent)',padding:'.35rem .45rem',borderRadius:6,background:'var(--accent-soft)'}}
                              >{item.title.length>36? item.title.slice(0,33)+'…': item.title}</Link>
                              <button
                                onClick={(e)=>handleRemove(e, id)}
                                disabled={removingId===id}
                                style={{background:'none',border:'1px solid var(--border-soft)',color:'var(--text-soft)',fontSize:'.6rem',padding:'.25rem .4rem',borderRadius:6,cursor:'pointer',lineHeight:1,letterSpacing:'.5px'}}
                                aria-label="Remove from watchlist"
                              >{removingId===id? '...':'Remove'}</button>
                            </li>
                          );
                        })}
                        {wishlist.length>8 && (
                          <li>
                            <Link to="/wishlist" onClick={()=>setShowProfileMenu(false)} style={{display:'block',textDecoration:'none',fontSize:'.7rem',fontWeight:600,color:'var(--accent)',padding:'.4rem .45rem'}}>View all ({wishlist.length})</Link>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div style={{borderTop:'1px solid var(--border-soft)',margin:'.85rem 0 .75rem'}} />
                  <button
                    onClick={handleLogout}
                    style={{width:'100%',background:'var(--accent)',color:'#fff',border:'none',borderRadius:8,padding:'.55rem .9rem',fontSize:'.72rem',fontWeight:600,letterSpacing:'.5px',cursor:'pointer'}}
                  >Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;