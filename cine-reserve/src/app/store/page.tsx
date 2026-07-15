"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { mockTheaters } from '@/data/mockMovies';

interface StoreItem {
  id: string;
  name: string;
  subInfo: string;
  price: number;
  category: 'combo' | 'popcorn' | 'drink' | 'snack';
  imageUrl?: string;
  icon: string;
}

interface CartItem {
  item: StoreItem;
  quantity: number;
}

export default function StorePage() {
  const router = useRouter();
  const { selectedTheater, selectTheaterAndDate } = useBooking();
  
  const [activeTab, setActiveTab] = useState<'fast' | 'gift'>('fast');
  const [activeSubTab, setActiveSubTab] = useState<'combo' | 'popcorn' | 'drink' | 'snack'>('combo');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const activeTheaterName = selectedTheater?.name || "고양행신";

  const storeItems: StoreItem[] = [
    // 콤보
    { id: "c1", name: "라지콤보", subInfo: "팝콘L2 + 탄산L2", price: 17000, category: "combo", icon: "🍿🥤🥤" },
    { id: "c2", name: "비어세트", subInfo: "맥주1 + 스낵1", price: 10500, category: "combo", icon: "🍺🥨" },
    { id: "c3", name: "시그니처 팝콘콤보", subInfo: "시그니처스위트팝콘2 + 탄산M2", price: 13000, category: "combo", icon: "🍿🍿🥤🥤" },
    { id: "c4", name: "한 마리 통통오징어 콤보", subInfo: "팝콘L1 + 음료M2 + 통통오징어1", price: 20900, category: "combo", icon: "🍿🥤🥤🦑" },
    // 팝콘
    { id: "p1", name: "팝콘(L)", subInfo: "팝콘(L) 고소/달콤", price: 6500, category: "popcorn", icon: "🍿" },
    { id: "p2", name: "팝콘(M)", subInfo: "팝콘(M) 고소/달콤", price: 5500, category: "popcorn", icon: "🍿" },
    { id: "p3", name: "시그니처 스위트 팝콘", subInfo: "카라멜 코팅 명작 팝콘", price: 6000, category: "popcorn", icon: "🍿✨" },
    // 음료
    { id: "d1", name: "셀프 탄산(M)", subInfo: "원하는 맛으로 시원하게", price: 3500, category: "drink", icon: "🥤" },
    { id: "d2", name: "셀프 탄산(L)", subInfo: "원하는 맛으로 시원하게", price: 4000, category: "drink", icon: "🥤" },
    { id: "d3", name: "에이드", subInfo: "자몽/오렌지 상큼 상큼", price: 6000, category: "drink", icon: "🍊" },
    { id: "d4", name: "BIG 커피", subInfo: "더 크게 즐기는 아메리카노", price: 5000, category: "drink", icon: "☕" },
    // 스낵
    { id: "s1", name: "칠리치즈나쵸", subInfo: "바삭한 나쵸와 소스 2종", price: 6000, category: "snack", icon: "🧀" },
    { id: "s2", name: "버터구이 오징어몸통", subInfo: "쫄깃 고소 오징어몸통", price: 5500, category: "snack", icon: "🦑" }
  ];

  const displayedItems = storeItems.filter(item => item.category === activeSubTab);

  const addToCart = (item: StoreItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.item.id !== id));
    } else {
      setCart(prev => prev.map(i => i.item.id === id ? { ...i, quantity: qty } : i));
    }
  };

  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  const handleCheckout = () => {
    const num = `#${Math.floor(100 + Math.random() * 900)}`;
    setOrderNumber(num);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="flex-1 bg-[#F4F5F7] text-gray-900 pb-20 w-full select-none flex flex-col min-h-screen relative">
      
      {/* 1. Header with shopping cart badge */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-1">
          <span>🍿 매점</span>
        </h2>
        
        {/* Shopping Cart button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-1.5 text-gray-700 hover:text-[#E51937] transition-colors relative cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalCartQty > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#E51937] border-2 border-white text-[9px] font-black text-white flex items-center justify-center">
              {totalCartQty}
            </span>
          )}
        </button>
      </div>

      {/* 2. Top Order Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2 w-full">
        <button
          onClick={() => setActiveTab('fast')}
          className={`flex-1 py-2 text-center text-xs font-black rounded-xl border transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'fast'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          <span>⚡ 패스트오더</span>
        </button>
        <button
          onClick={() => setActiveTab('gift')}
          className={`flex-1 py-2 text-center text-xs font-black rounded-xl border transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'gift'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          <span>🎁 기프트샵</span>
        </button>
      </div>

      {/* 3. Theater Select bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-800 w-full">
        <span className="flex items-center gap-1.5">
          <span className="text-[#E51937]">📍</span>
          <span>{activeTheaterName}</span>
          <span className="text-[10px] text-gray-400 font-semibold">| 3.1km</span>
        </span>
        <button
          onClick={() => setIsTheaterModalOpen(true)}
          className="text-xs text-gray-400 border border-gray-200 hover:border-gray-300 px-2.5 py-1 rounded bg-gray-50 cursor-pointer"
        >
          극장변경
        </button>
      </div>

      {/* 4. FAST ORDER PROMO BANNER (KakaoTalk_...png) */}
      <div className="m-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm">
        <div className="max-w-[60%]">
          <span className="text-[9px] text-[#E51937] font-black tracking-wider uppercase block">FAST ORDER</span>
          <h3 className="text-xs font-black text-gray-900 leading-tight mt-1.5">키오스크에서 기다리지말고 패스트오더로 주문하고 픽업하세요!</h3>
        </div>
        <div className="text-3xl">🍿🍔🥤</div>
      </div>

      {/* 5. Store sub-category pills */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2 w-full text-xs font-bold">
        {[
          { id: 'combo', name: '콤보' },
          { id: 'popcorn', name: '팝콘' },
          { id: 'drink', name: '음료' },
          { id: 'snack', name: '스낵' }
        ].map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeSubTab === sub.id
                ? 'bg-black border-black text-white'
                : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* 6. Item Grid List (KakaoTalk_...01.png) */}
      <div className="p-4 grid grid-cols-2 gap-3 flex-1 bg-white">
        {displayedItems.map(item => (
          <div key={item.id} className="border border-gray-100 bg-gray-50/50 p-3 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden text-left hover:shadow transition-all border-transparent hover:border-gray-200">
            
            {/* Visual Icon Box */}
            <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center text-4xl shadow-sm border border-gray-100 relative">
              {item.icon}
              
              {/* Add to Cart small round button (🛒) */}
              <button
                onClick={() => addToCart(item)}
                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 flex items-center justify-center text-gray-700 active:scale-95 transition-all cursor-pointer"
                title="장바구니 담기"
              >
                🛒
              </button>
            </div>

            <div className="mt-3">
              <h4 className="font-extrabold text-xs text-gray-900 truncate">{item.name}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.subInfo}</p>
              <span className="text-xs font-black text-gray-900 block mt-2">{item.price.toLocaleString()}원</span>
            </div>

          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SHOPPING CART BOTTOM DRAWER / MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-black text-gray-900">장바구니</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 font-semibold">
                장바구니에 담긴 상품이 없습니다.
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cart.map(c => (
                  <div key={c.item.id} className="flex items-center justify-between py-1 text-left">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">{c.item.name}</h4>
                      <span className="text-[10px] text-gray-400">{(c.item.price * c.quantity).toLocaleString()}원</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQty(c.item.id, c.quantity - 1)}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{c.quantity}</span>
                      <button
                        onClick={() => updateCartQty(c.item.id, c.quantity + 1)}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>총 결제금액</span>
                  <span className="text-[#E51937] font-black text-sm">{totalCartPrice.toLocaleString()}원</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-[#E51937] hover:bg-[#d1152f] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  주문 결제하기 (패스트오더)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* THEATER SELECTION MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isTheaterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-black text-gray-900">극장 선택 (매점 주문 지점)</h3>
              <button
                type="button"
                onClick={() => setIsTheaterModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 py-2">
              {mockTheaters.map(t => {
                const isSelected = selectedTheater?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      selectTheaterAndDate(t, new Date().toISOString().split('T')[0]);
                      setIsTheaterModalOpen(false);
                    }}
                    className={`w-full py-3.5 px-4 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected 
                        ? 'bg-[#E51937]/5 border-[#E51937] text-[#E51937]' 
                        : 'bg-gray-50 border-transparent hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{t.name}</span>
                    {isSelected && <span className="text-[#E51937]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* ORDER CONFIRMATION MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      {orderNumber && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="font-extrabold text-base text-gray-900 leading-tight">패스트오더 주문 완료!</h3>
            <p className="text-[10px] text-gray-400 mt-1">지점 키오스크 또는 픽업대에서 번호표를 제시해 주세요.</p>

            <div className="my-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">주문 지점</span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5">{activeTheaterName}점</span>
              
              <span className="text-[10px] text-gray-400 font-bold block uppercase mt-3">대기 번호</span>
              <span className="text-3xl font-black text-[#E51937] block mt-1.5 tracking-wider">{orderNumber}</span>
            </div>

            <button
              onClick={() => setOrderNumber(null)}
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
