"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingCart, Phone, MapPin, CheckCircle, Flame, ShieldCheck, 
  Clock, Plus, Minus, X, Info, CreditCard, PlayCircle, ChevronLeft, 
  ChevronRight, Star, MessageSquare, Music, Hash, ShoppingBag, Utensils
} from 'lucide-react';

export default function CustomerLandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [bundlesData, setBundlesData] = useState<any[]>([]); // Menyimpan stok dinamis bundling
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // State untuk Galeri Produk Pop-up
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  // Form Checkout
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  
  // DEFAULT "pickup" (Ambil Sendiri)
  const [deliveryMode, setDeliveryMode] = useState('pickup'); 
  const [courier, setCourier] = useState('ahsan'); // 'ahsan', 'umiwa', 'gosend'
  const [addPacking, setAddPacking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qris'); // Pilihan: 'qris', 'bsi', 'cash'
  const [packingOption, setPackingOption] = useState('pouch'); // 'pouch' atau 'cooler'

  // === AUTO RESET METODE PEMBAYARAN ===
  // Jika pilih dikirim pakai Ahsan, Paxel, atau Gosend tapi pembayarannya Cash, paksa balik ke QRIS!
  useEffect(() => {
    if (deliveryMode === 'delivery' && (courier === 'ahsan' || courier === 'paxel' || courier === 'gosend')) {
      if (paymentMethod === 'cash') {
        setPaymentMethod('qris');
      }
    }
  }, [deliveryMode, courier, paymentMethod]);
  // =====================================
  
  // State Alamat Lengkap
  const [address, setAddress] = useState({
    jalan: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: ''
  });

  // === SAKLAR RAHASIA ADMIN ===
  // Ganti kata "true" menjadi "false" untuk MEMATIKAN / MENYEMBUNYIKAN Kurir Umiwa
  // Ganti jadi "true" lagi kalau mau MENGAKTIFKAN kembali.
  const IS_KURIR_UMIWA_AKTIF = true;
  
  // === TAMBAHKAN BARIS INI UNTUK SENSOR SWIPE ===
  const touchStartY = React.useRef(0);
  
  // Fungsi untuk tombol panah Testimoni di Laptop/PC
  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (testiScrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 300;
      testiScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // === KODE BARU: AUTO SCROLL SUPER SMOOTH (PING-PONG) ===
  const quickLinksRef = React.useRef<HTMLDivElement>(null);
  const quickLinksDir = React.useRef(1);
  
  const testiScrollRef = React.useRef<HTMLDivElement>(null);
  const testiDir = React.useRef(1);

  useEffect(() => {
    let animationId1: number;
    let animationId2: number;

    const animateScroll = (container: HTMLDivElement | null, dirRef: React.MutableRefObject<number>, setAnimId: (id: number) => void) => {
      if (!container) return;

      // Cek batas kanan dan kiri untuk mantul (ping-pong)
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
        dirRef.current = -1; // Balik kiri
      } else if (container.scrollLeft <= 0) {
        dirRef.current = 1; // Balik kanan
      }

      // Geser 1 pixel per frame (Sangat halus, sekitar 60px per detik)
      container.scrollLeft += dirRef.current * 1;

      // Looping animasi terus menerus tanpa henti
      const id = requestAnimationFrame(() => animateScroll(container, dirRef, setAnimId));
      setAnimId(id);
    };

    // Nyalakan mesin animasi untuk kedua bagian
    animateScroll(quickLinksRef.current, quickLinksDir, (id) => animationId1 = id);
    animateScroll(testiScrollRef.current, testiDir, (id) => animationId2 = id);

    return () => {
      cancelAnimationFrame(animationId1);
      cancelAnimationFrame(animationId2);
    };
  }, []);
  // ====================================================

  // 1. KAMUS KATALOG PRODUK SATUAN
  const CATALOG = [
    { 
      name: "Pempek Isi 20", price: 35000, normalPrice: 45000, img: "/pempek-20.jpg", 
      desc: "Cocok banget buat stok cemilan sekeluarga. (Terdiri dari: 5 Adaan, 5 Kulit, 5 Lenjer, 5 Telor).",
      media: [
        { type: 'image', url: '/pempek-20.jpg' }, { type: 'image', url: '/pempek-20-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/dtzh8Cd15Ao" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` } 
      ]
    },
    { 
      name: "Pempek Isi 15", price: 30000, normalPrice: 35000, img: "/pempek-15.jpg", 
      desc: "Porsi nanggung yang pas buat nemenin kerja santai. (Terdiri dari: 4 Adaan, 4 Kulit, 4 Lenjer, 3 Telur).",
      media: [
        { type: 'image', url: '/pempek-15.jpg' }, { type: 'image', url: '/pempek-15-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/K8wCt9dprfY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Pempek Isi 10", price: 20000, normalPrice: 25000, img: "/pempek-10.jpg", 
      desc: "Pilihan pas buat me-time atau ganjal perut saat malam. (Terdiri dari: 2 Adaan, 3 Kulit, 3 Lenjer, 2 Telur).",
      media: [
        { type: 'image', url: '/pempek-10.jpg' }, { type: 'image', url: '/pempek-10-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/C-MCL_YVA-0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Pempek Besar isi 10", price: 35000, normalPrice: 45000, img: "/pempek-besar.jpg", 
      desc: "Ukuran jumbo, puas di setiap gigitan! (Terdiri dari: 2 Adaan, 3 Kulit, 3 Lenjer, 2 Telur).",
      media: [
        { type: 'image', url: '/pempek-besar.jpg' }, { type: 'image', url: '/pempek-besar-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/2eZ2gNoPS4o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Pempek Kapal Selam isi Telur", price: 28000, normalPrice: 35000, img: "/kapal-selam.jpg", 
      // Kapal selam tidak diubah sesuai instruksi Bos
      desc: "Spesial buat pecinta telur. Sajian utama yang bikin perut langsung full dan happy!",
      media: [
        { type: 'image', url: '/kapal-selam.jpg' }, { type: 'image', url: '/kapal-selam-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/W7CMh6uJ6-0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Tekwan", price: 35000, normalPrice: 40000, img: "/tekwan.jpg", 
      desc: "Penyelamat di saat hujan atau butuh yang hangat. Kuah kaldunya bikin rileks! (Berat: 400 gr).",
      media: [
        { type: 'image', url: '/tekwan.jpg' }, { type: 'image', url: '/tekwan-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/VBTC7sTMqbY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Adaan+Kulit isi 12", price: 20000, normalPrice: 25000, img: "/adaan.jpg", 
      desc: "Cemilan gurih favorit semua usia. Nggak mau berhenti ngunyah! (Terdiri dari: 6 Adaan, 6 Kulit).",
      media: [
        { type: 'image', url: '/adaan.jpg' }, { type: 'image', url: '/adaan-2.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/MYLM0py1TFs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Cuko 100 ml", // ⚠️ PENTING: Nama ini HARUS SAMA PERSIS ejaannya dengan yang Bos input di Supabase/Halaman Stok Admin.
      price: 12000,        // Harga Jual (Harga yang harus dibayar konsumen)
      normalPrice: 15000,  // Harga Coret (Kosongkan atau hapus baris ini jika tidak mau ada efek diskon)
      img: "/cuko-100ml.jpg", // Pastikan Bos memasukkan foto cuko ke dalam folder "public" dengan nama ini
      desc: "Tambahan cuko kental, pedas, asam, manis khas Palembang asli. Bikin makan pempek makin banjir dan mantap!",
      media: [
        { type: 'image', url: '/cuko-100ml.jpg' }
        // Kalau Bos punya video youtube untuk Cuko, bisa tambahkan di baris bawah ini seperti produk lain
      ]
    }
  ];

  // 2. KAMUS PAKET BUNDLING (DENGAN INFO AUTO-SWAP)
  const BUNDLES = [
    { 
      name: "Paket Cicip (2 packs)", 
      price: 44000, normalPrice: 48000, 
      img: "/paket-cicip.jpg", 
      desc: [
        "1x Pempek Isi 10 (Bisa ditukar Adaan+Kulit)",
        "1x Pempek Kapal Selam isi Telur"
      ],
      media: [
        { type: 'image', url: '/paket-cicip.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/MXQ8NJricNI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Paket Keluarga (3 packs)", 
      price: 80000, normalPrice: 90000, 
      img: "/paket-keluarga.jpg", 
      desc: [
        "1x Pempek Isi 20 (Bisa ditukar 2x Pempek isi 10)",
        "1x Adaan+Kulit isi 12 (Bisa ditukar Pempek isi 10)",
        "1x Tekwan (Bisa ditukar Pempek Besar isi 10)"
      ],
      media: [
        { type: 'image', url: '/paket-keluarga.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/BujPFKV1of0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    },
    { 
      name: "Paket Istimewa (5 packs)", 
      price: 139000, normalPrice: 153000, 
      img: "/paket-istimewa.jpg", 
      desc: [
        "1x Pempek Isi 20 (Bisa ditukar 2x Pempek isi 10)",
        "1x Pempek Besar isi 10 (Bisa ditukar Tekwan)",
        "1x Tekwan (Bisa ditukar Pempek Besar isi 10)",
        "1x Adaan+Kulit isi 12 (Bisa ditukar Pempek isi 10)",
        "1x Pempek Kapal Selam isi Telur"
      ],
      media: [
        { type: 'image', url: '/paket-istimewa.jpg' },
        { type: 'video', embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/3OUJtJNE7p8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }
      ]
    }
  ];

    // 3. DATA TESTIMONI PELANGGAN 
  const TESTIMONIALS = [
    { name: "Bunda Rara", rating: 5, text: "Maknyuss banget. Pempeknya kerasa ikannya, teksturnya kenyal tapi tetap lembut. Cuko juga pas, nggak terlalu manis dan nggak terlalu tajem. Repeat order sih ini.", img: "/testi-1.jpg" },
    { name: "Kang Dimas", rating: 5, text: "Udah langganan beli paket istimewa. Pengiriman cepat, kondisi masih beku sempurna. Enak banget buat stok cemilan di rumah.", img: "/testi-2.jpg" },
    { name: "Teh Siska", rating: 5, text: "Gak nyangka di Cimahi ada pempek seenak ini yang ready stok. Packingnya aman, rasanya manteplah pokoknya waijb cobainn!", img: "/testi-3.jpg" },
    { name: "Ibu Indah", rating: 5, text: "Sumpah ini pempek enak banget sih. Pas digoreng wanginya serumah. Mantap Umiwa!", img: "/testi-4.jpg" },
    { name: "Pak Ridwan", rating: 5, text: "Salah satu frozen pempek yang menurut saya kualitasnya bagus. Packaging rapi dan pas datang kondisinya masih fresh.", img: "/testi-5.jpg" },
    { name: "Mbak Yanti", rating: 5, text: "Baru keluar dari freezer terus direbus sebentar aja hasilnya tetap bagus. Nggak hancur, nggak berubah rasa.", img: "/testi-6.jpg" }
  ];

  // AMBIL DATA STOK DARI SUPABASE SINKRONISASI
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    const { data: batches } = await supabase.from('batches').select('*').neq('status', 'Sold Out');
    const { data: trx } = await supabase.from('transactions').select('*');

    if (batches && trx) {
      const stockMap = new Map();
      
      batches.forEach(b => {
        // PERBAIKAN: Potong teks jika ada nama paket
        const rawName = (b.product_name || '').split(' | ')[0];
        const key = rawName.trim().toLowerCase();
        
        if (!stockMap.has(key)) stockMap.set(key, 0);
        stockMap.set(key, stockMap.get(key) + Number(b.total_qty || 0));
      });

      trx.forEach(t => {
        // PERBAIKAN: Potong teks jika ada nama paket
        const rawName = (t.product_name || '').split(' | ')[0];
        const key = rawName.trim().toLowerCase();
        
        if (stockMap.has(key)) {
          stockMap.set(key, stockMap.get(key) - Number(t.qty || 0));
        }
      });

      // 1. SET STOK UNTUK SATUAN
      const activeProducts = CATALOG.map(cat => {
        const stock = stockMap.get(cat.name.toLowerCase()) || 0;
        return { ...cat, stock };
      });
      setProducts(activeProducts);

      // 2. HITUNG OTOMATIS STOK BUNDLING (SMART FALLBACK / ALTERNATIF)
      const activeBundles = BUNDLES.map(b => {
        let effStock = 0;
        
        // Tarik angka stok asli dari freezer (sudah dibersihkan dari " | Paket Cicip")
        const stIsi10 = stockMap.get("pempek isi 10") || 0;
        const stIsi20 = stockMap.get("pempek isi 20") || 0;
        const stBesar = stockMap.get("pempek besar isi 10") || 0;
        const stTekwan = stockMap.get("tekwan") || 0;
        const stAdaan = stockMap.get("adaan+kulit isi 12") || 0;
        const stSelam = stockMap.get("pempek kapal selam isi telur") || 0;

        // Logika Substitusi / Pertukaran Stok
        if (b.name === "Paket Cicip (2 packs)") {
           const effIsi10 = stIsi10 + stAdaan; // Bisa ditukar Adaan
           effStock = Math.min(effIsi10, stSelam);
        } else if (b.name === "Paket Keluarga (3 packs)") {
           const effIsi20 = stIsi20 + Math.floor(stIsi10 / 2); // Isi 20 bisa diganti 2x Isi 10
           const effAdaan = stAdaan + stIsi10; // Adaan bisa diganti Isi 10
           const effTekwan = stTekwan + stBesar; // Tekwan bisa diganti Besar 10
           effStock = Math.min(effIsi20, effAdaan, effTekwan);
        } else if (b.name === "Paket Istimewa (5 packs)") {
           const effIsi20 = stIsi20 + Math.floor(stIsi10 / 2);
           const effAdaan = stAdaan + stIsi10;
           // Khusus paket ini, butuh 1 Tekwan & 1 Besar. Berarti butuh total 2 stok gabungan dari mereka
           const effTekwanBesar = Math.floor((stTekwan + stBesar) / 2); 
           effStock = Math.min(effIsi20, effAdaan, effTekwanBesar, stSelam);
        }

        return { ...b, stock: effStock };
      });
      setBundlesData(activeBundles);
    }
  };

  // FUNGSI KERANJANG BELANJA (DENGAN PENGUNCI STOK MAKSIMAL)
  const addToCart = (item: any, type: 'satuan' | 'bundling') => {
    if (item.stock <= 0) return alert('Maaf, stok habis!');
    
    const existing = cart.find(c => c.name === item.name);
    if (existing) {
      if (existing.qty >= item.stock) {
        alert(`Maaf, semua sisa stok yang tersedia (${item.stock} paket) sudah masuk ke keranjang Anda!`);
        return;
      }
      setCart(cart.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (name: string, delta: number) => {
    // Cari data batas maksimal stoknya (cek di satuan dulu, kalau tidak ada cek di bundling)
    const itemData = products.find(p => p.name === name) || bundlesData.find(b => b.name === name);

    setCart(cart.map(c => {
      if (c.name === name) {
        const newQty = c.qty + delta;
        
        if (delta > 0 && itemData && newQty > itemData.stock) {
          alert(`Maaf, stok untuk ${name} hanya tersedia ${itemData.stock} paket!`);
          return c; 
        }
        
        return { ...c, qty: Math.max(0, newQty) };
      }
      return c;
    }).filter(c => c.qty > 0));
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

  // Hitungan Tambahan (Pengiriman & Packing)
  let shippingFee = 0;
  if (deliveryMode === 'delivery') {
      if (courier === 'ahsan') shippingFee = 12000;
      if (courier === 'umiwa') shippingFee = 9000;
      // Khusus paxel ongkirnya 0 karena nanti dihitung manual via WA
      if (courier === 'paxel') shippingFee = 0; 
  }

  let packingFee = 0;
  if (deliveryMode === 'delivery' && courier === 'paxel') {
      // LOGIKA BARU: Otomatis hitung packing Paxel berdasarkan jumlah pack
      packingFee = totalItems <= 3 ? 3000 : 5000;
  } else if (addPacking) {
      // Packing standar untuk kurir selain Paxel
      packingFee = packingOption === 'pouch' ? 2500 : 3000;
  }
  const grandTotal = totalCart + shippingFee + packingFee;

  // FUNGSI CHECKOUT KE WHATSAPP
  const handleCheckoutWA = () => {
    if (!custName || !custPhone) return alert("Mohon isi Nama dan No. WhatsApp Anda terlebih dahulu.");
    if (cart.length === 0) return alert("Keranjang masih kosong.");

    if (deliveryMode === 'delivery' && (courier === 'ahsan' || courier === 'umiwa' || courier === 'paxel')) {
        if (!address.jalan || !address.kelurahan || !address.kecamatan || !address.kota) {
            return alert("Mohon lengkapi semua rincian alamat pengiriman Anda (Jalan, Kelurahan, Kecamatan, & Kota).");
        }
    }

    let message = `Halo Admin Pempek Umiwa! 👋\nSaya mau order dong:\n\n`;
    message += `*Data Pemesan:*\nNama: ${custName}\nWA: ${custPhone}\n`;
    message += `Pengiriman: ${deliveryMode === 'delivery' ? '🛵 Dikirim' : '🏪 Ambil Sendiri'}\n`;
    
    if (deliveryMode === 'delivery') {
        if (courier === 'ahsan') message += `Kurir: Ahsan Xpress Sameday\n`;
        if (courier === 'umiwa') message += `Kurir: Kurir Umiwa Instant\n`;
        if (courier === 'gosend') message += `Kurir: Gosend / Grab (Pesan Sendiri)\n`;
        
        if (courier === 'ahsan' || courier === 'umiwa') {
            // Hilangkan bagian Prov. ${address.provinsi}
            message += `\n*Alamat Pengiriman:*\n${address.jalan}\nKel. ${address.kelurahan}, Kec. ${address.kecamatan}\n${address.kota}\n`;
        }
    }

    let packingText = '❌ Tidak';
    if (deliveryMode === 'delivery' && courier === 'paxel') {
        packingText = totalItems <= 3 ? '📦 Packing Khusus Paxel (1-3 Pack) (+Rp3.000)' : '📦 Packing Khusus Paxel (>3 Pack) (+Rp5.000)';
    } else if (addPacking) {
        packingText = packingOption === 'pouch' ? '📦 Thermal Pouch (+Rp2.500)' : '🛍️ Thermal Cooler Bag (+Rp3.000)';
    }
    message += `Tambahan Packing: ${packingText}\n\n`;
    message += `*Rincian Pesanan:*\n`;
    
    cart.forEach(item => {
      message += `▪️ ${item.qty}x ${item.name} (${formatIDR(item.price * item.qty)})\n`;
    });

   message += `\nSubtotal: ${formatIDR(totalCart)}\n`;
    if (deliveryMode === 'delivery' && courier !== 'paxel') message += `Ongkir: ${formatIDR(shippingFee)}\n`;
    // Ubah baris addPacking agar packing Paxel juga ikut tercetak di WA
    if (addPacking || (deliveryMode === 'delivery' && courier === 'paxel')) {
        message += `Packing: ${formatIDR(packingFee)}\n`;
    }

    // Ubah bagian ini agar ada teks khusus Paxel
    if (deliveryMode === 'delivery' && courier === 'paxel') {
        message += `\n*GRAND TOTAL: ${formatIDR(grandTotal)} + Ongkir Paxel (Diinfokan WA)*\n\n`;
    } else {
        message += `\n*GRAND TOTAL: ${formatIDR(grandTotal)}*\n\n`;
    }

    let paymentText = '';
    if (paymentMethod === 'qris') paymentText = 'QRIS';
    else if (paymentMethod === 'bsi') paymentText = 'Transfer BSI';
    else if (paymentMethod === 'cash') paymentText = 'Cash / Tunai';
    
    message += `*Metode Pembayaran:* ${paymentText}\n\n`;
    message += `Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6287788472837?text=${encodedMessage}`, '_blank');
  };

  const openGallery = (product: any) => {
    setSelectedProduct(product);
    setActiveMediaIndex(0);
    setGalleryOpen(true);
  };

  const nextMedia = () => {
    if (!selectedProduct) return;
    setActiveMediaIndex((prev) => (prev + 1) % selectedProduct.media.length);
  };

  const prevMedia = () => {
    if (!selectedProduct) return;
    setActiveMediaIndex((prev) => (prev - 1 + selectedProduct.media.length) % selectedProduct.media.length);
  };

  // Fungsi khusus untuk smooth scroll ke section tertentu
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset untuk memberi ruang sedikit di atas judul
      const y = element.getBoundingClientRect().top + window.scrollY - 30;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen pb-28 md:pb-32 scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-emerald-800 text-white pb-16 pt-12 md:pb-20 md:pt-24 rounded-b-[32px] md:rounded-b-[40px] shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[url('/hero-bg.jpg')] bg-cover bg-center rounded-b-[32px] md:rounded-b-[40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent rounded-b-[32px] md:rounded-b-[40px]"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 md:px-6 text-center z-10">
          <div className="inline-block bg-white p-1.5 md:p-2 rounded-full mb-4 md:mb-6 shadow-xl animate-in zoom-in duration-500">
             <img src="/logo-umiwa.jpg" alt="Logo Umiwa" className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-2 border-emerald-100" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 tracking-tight drop-shadow-md">PEMPEK UMIWA</h1>
          <p className="text-lg md:text-2xl font-bold text-emerald-300 mb-1 md:mb-2 italic drop-shadow-sm">"100% Ikan Tenggiri Asli"</p>
          <p className="text-xs md:text-lg text-emerald-100 mb-6 md:mb-8 font-medium">Asli Tenggirinya, Asli Enaknya.</p>
          
          {/* KUMPULAN INFO KEUNGGULAN (DESAIN BARU - BUKAN TOMBOL) */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-6 gap-y-2 text-[10px] md:text-sm font-medium text-emerald-50 mt-2">
            <span className="flex items-center tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1 md:mr-1.5 text-emerald-400"/> HALAL 100%
            </span>
            <span className="hidden md:block text-emerald-500/50">•</span>
            
            <span className="flex items-center tracking-wide">
              <Info className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1 md:mr-1.5 text-emerald-400"/> Tanpa Pengawet
            </span>
            <span className="hidden md:block text-emerald-500/50">•</span>
            
            <span className="flex items-center tracking-wide">
              <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1 md:mr-1.5 text-emerald-400"/> Ready Stok (Tanpa PO)
            </span>
            <span className="hidden md:block text-emerald-500/50">•</span>
            
            <span className="flex items-center tracking-wide text-sky-100">
              <CheckCircle className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1 md:mr-1.5 text-sky-400"/> Frozen Fresh
            </span>
            <span className="hidden md:block text-emerald-500/50">•</span>
            
            <span className="flex items-center tracking-wide text-amber-100">
              <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1 md:mr-1.5 text-amber-400"/> Harga Terjangkau
            </span>
          </div>

          {/* === TOMBOL WA LANGSUNG DI HERO SECTION === */}
          <div className="mt-6 md:mt-8 animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <a 
              href="https://wa.me/6287788472837?text=Halo%20Admin%20Umiwa%2C%20saya%20tertarik%20mau%20pesan%20pempeknya%20nih!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] text-white text-xs md:text-sm font-black px-6 py-3.5 md:px-8 md:py-4 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all border-2 border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4 md:w-5 md:h-5 mr-2">
                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.638-1.653-1.935-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              CHAT ADMIN VIA WA
            </a>
          </div>
          {/* ========================================= */}

        </div>
      </section>

      {/* SHORTCUT MENU / QUICK LINKS */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8 relative z-30 mb-8 md:mb-10">
        <div 
          ref={quickLinksRef}
          className="bg-white/90 backdrop-blur-md rounded-[24px] md:rounded-[32px] shadow-xl p-2 md:p-4 border border-white/50 flex overflow-x-auto gap-2 md:gap-3 items-center" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
           <a href="#testimoni" onClick={(e) => scrollToSection(e, 'testimoni')} className="shrink-0 flex items-center bg-white hover:bg-emerald-500 text-slate-700 hover:text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group">
             <Star className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-amber-400 group-hover:text-white"/> Testimoni
           </a>
           <a href="#penyajian" onClick={(e) => scrollToSection(e, 'penyajian')} className="shrink-0 flex items-center bg-white hover:bg-emerald-500 text-slate-700 hover:text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group">
             <Utensils className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-rose-400 group-hover:text-white"/> Saran Penyajian
           </a>
           <a href="#lokasi" onClick={(e) => scrollToSection(e, 'lokasi')} className="shrink-0 flex items-center bg-white hover:bg-emerald-500 text-slate-700 hover:text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group">
             <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-indigo-400 group-hover:text-white"/> Lokasi Maps
           </a>
           <a href="#aplikasi" onClick={(e) => scrollToSection(e, 'aplikasi')} className="shrink-0 flex items-center bg-white hover:bg-emerald-500 text-slate-700 hover:text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group">
             <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-amber-500 group-hover:text-white"/> Pesan via Aplikasi
           </a>
           <a href="#qris" onClick={(e) => scrollToSection(e, 'qris')} className="shrink-0 flex items-center bg-white hover:bg-emerald-500 text-slate-700 hover:text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group">
             <CreditCard className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-emerald-500 group-hover:text-white"/> QRIS Umiwa
           </a>
           <a href="#sosmed" onClick={(e) => scrollToSection(e, 'sosmed')} className="shrink-0 flex items-center bg-white hover:bg-emerald-500 text-slate-700 hover:text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group">
             <Hash className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-blue-500 group-hover:text-white"/> Sosial Media
           </a>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 md:px-6 relative z-20 space-y-12 md:space-y-16">
        
        {/* 2. DAFTAR PAKET BUNDLING */}
        <section id="bundling" className="scroll-mt-10">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center justify-center">
              <Flame className="w-6 h-6 md:w-8 h-8 mr-2 text-rose-500 animate-pulse" /> PAKET BUNDLING
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2 font-medium">Lebih hemat, lebih puas! Cocok untuk stok di kulkas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {/* PASTIKAN SEKARANG MAPPING-NYA PAKAI bundlesData, BUKAN BUNDLES LAGI */}
            {bundlesData.map((b, i) => (
              <div key={i} className="bg-white rounded-[24px] md:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-rose-100 overflow-hidden group hover:shadow-[0_8px_30px_rgb(225,29,72,0.15)] hover:border-rose-300 transition-all duration-300 flex flex-col relative">
                
                <div className="absolute top-0 right-0 z-10 bg-gradient-to-bl from-rose-600 to-red-500 text-white font-black px-4 py-2 md:px-5 md:py-2.5 rounded-bl-[24px] md:rounded-bl-[32px] shadow-lg flex flex-col items-center">
                    <span className="text-[8px] md:text-[9px] text-rose-100 uppercase tracking-widest leading-none mb-0.5">Diskon Hemat</span>
                    <span className="text-sm md:text-lg leading-none">{formatIDR(b.normalPrice - b.price)}</span>
                </div>

                <div className="h-44 md:h-56 bg-slate-100 relative overflow-hidden cursor-pointer" onClick={() => openGallery(b)}>
                  <img src={b.img} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=Foto+Menyusul'} />
                  
                  {/* TULISAN HABIS KALAU STOK BUNDLING 0 */}
                  {b.stock <= 0 && <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-20"><span className="bg-rose-500 text-white font-black px-4 py-2 rounded-full text-xs shadow-xl transform -rotate-12 border-2 border-white">HABIS!</span></div>}

                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all duration-300 flex items-center justify-center z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg flex items-center">
                      <PlayCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-rose-600"/> Lihat Detail
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <h3 className="font-black text-slate-800 text-lg md:text-xl mb-2 md:mb-3 leading-tight">{b.name}</h3>
                  
                  {/* DAFTAR ISI PAKET (DESAIN UI BARU) */}
                  <ul className="text-xs md:text-sm text-slate-500 font-medium mb-4 flex-1 space-y-2.5">
                    {b.desc.map((item: string, idx: number) => {
                      // Trik memisahkan teks utama dan teks di dalam kurung
                      const parts = item.split(' (Bisa ditukar ');
                      const mainText = parts[0];
                      const swapText = parts[1] ? parts[1].replace(')', '') : null;

                      return (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2.5 mt-0.5 flex items-center justify-center bg-rose-100 text-rose-500 w-4 h-4 rounded-full text-[9px] shrink-0 font-black shadow-sm">✓</span> 
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 leading-tight">{mainText}</span>
                            
                            {/* Munculkan Badge/Label Tukar jika ada */}
                            {swapText && (
                              <span className="inline-flex items-center mt-1.5 text-[9px] md:text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md w-max shadow-sm">
                                🔁 Bisa Tukar: {swapText}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Info Tambahan (Dibuat Lebih Minimalis & Elegan) */}
                  <div className="bg-slate-50 border border-slate-200 p-2.5 md:p-3 rounded-xl mb-4 md:mb-6 flex items-center">
                      <span className="text-amber-500 mr-2 shrink-0 animate-pulse">💡</span>
                      <p className="text-[9px] md:text-[10px] text-slate-500 font-medium leading-tight">
                        Bebas <b className="text-slate-700">request tukar varian</b> (sesuai label alternatif di atas) saat lanjut checkout ke WhatsApp!
                      </p>
                  </div>
                  
                  <div className="bg-rose-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-rose-100 mb-4 md:mb-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10"><Flame className="w-16 h-16 md:w-20 md:h-20 text-rose-500"/></div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-0.5 md:mb-1">Harga Normal: <span className="line-through text-rose-400">{formatIDR(b.normalPrice)}</span></p>
                    <div className="flex items-end gap-2">
                        <p className="text-2xl md:text-3xl font-black text-rose-600 leading-none">{formatIDR(b.price)}</p>
                        <span className="bg-rose-600 text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md uppercase animate-pulse mb-0.5 md:mb-1">Super Deal!</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(b, 'bundling')} 
                    disabled={b.stock <= 0}
                    className={`w-full font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-lg active:scale-95 text-xs md:text-sm flex justify-center items-center ${
                      b.stock > 0 
                      ? 'bg-slate-900 text-white hover:bg-rose-600 shadow-slate-900/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {b.stock > 0 ? (
                      <><ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2"/> TAMBAH KE KERANJANG</>
                    ) : (
                      'KOSONG'
                    )}
                  </button>
                  {/* MENAMPILKAN TULISAN SISA STOKNYA! */}
                  {b.stock > 0 && <p className="text-[10px] text-center font-bold text-slate-400 mt-2">Tersedia: {b.stock} Paket</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MENU SATUAN */}
        <section id="menu-satuan" className="scroll-mt-10">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 mr-2 text-emerald-500" /> MENU SATUAN
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2 font-medium">Beli eceran sesuai selera favorit kamu.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((p, i) => (
              <div key={i} className="bg-white rounded-[20px] md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl hover:border-emerald-100 transition-all group">
                <div className="h-32 md:h-48 bg-slate-100 relative cursor-pointer overflow-hidden" onClick={() => openGallery(p)}>
                   
                   {/* STIKER MARKETING: TURUN HARGA & DISKON (Hanya Muncul Jika Ada Harga Coret) */}
                   {p.normalPrice && (
                     <>
                       {/* Stiker Kiri Atas */}
                       <div className="absolute top-0 left-0 z-20 bg-rose-600 text-white text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-br-[16px] shadow-md flex items-center">
                          <Flame className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 animate-pulse"/> TURUN HARGA
                       </div>
                       {/* Stiker Kanan Atas (Otomatis Hitung Persen) */}
                       <div className="absolute top-2 right-2 z-20 bg-amber-400 text-slate-900 text-[9px] md:text-xs font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg transform rotate-6 border-2 border-white">
                          DISKON {Math.round(((p.normalPrice - p.price) / p.normalPrice) * 100)}%
                       </div>
                     </>
                   )}

                   <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=Foto+Produk'} />
                   
                   {p.stock <= 0 && <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-30"><span className="bg-rose-500 text-white font-black px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs shadow-xl transform -rotate-12 border-2 border-white">HABIS!</span></div>}
                   <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-300 flex items-center justify-center z-10">
                      <div className="bg-white/90 p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all shadow-md">
                        <PlayCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600"/>
                      </div>
                   </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <h3 className="font-black text-slate-800 text-xs md:text-base leading-tight mb-1 md:mb-2">{p.name}</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-2 md:mb-4 flex-1 line-clamp-3 md:line-clamp-none">{p.desc}</p>
                  
                  {/* HARGA CORET & HARGA BARU */}
                  <div className="flex flex-col justify-end mb-3 md:mb-4 border-t border-slate-50 pt-2 md:pt-3">
                    {p.normalPrice && (
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 line-through mb-0.5">{formatIDR(p.normalPrice)}</p>
                    )}
                    <p className="text-base md:text-xl font-black text-emerald-600 leading-none">{formatIDR(p.price)}</p>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(p, 'satuan')} 
                    disabled={p.stock <= 0} 
                    className={`w-full font-black py-2.5 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-md active:scale-95 text-[10px] md:text-sm flex justify-center items-center ${
                      p.stock > 0 
                      ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {p.stock > 0 ? (
                      <><ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2"/> TAMBAH</>
                    ) : (
                      'KOSONG'
                    )}
                  </button>
                  {p.stock > 0 && <p className="text-[9px] md:text-[10px] text-center font-bold text-slate-400 mt-1.5 md:mt-2">Tersedia: {p.stock} Pack</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECTION TESTIMONI */}
        <section id="testimoni" className="bg-slate-900 text-white rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-2xl relative overflow-hidden scroll-mt-10">
          <div className="absolute -left-10 md:-left-20 -bottom-10 md:-bottom-20 opacity-5"><MessageSquare className="w-48 h-48 md:w-96 md:h-96" /></div>
          
          <div className="text-center mb-6 md:mb-10 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 text-white">KATA MEREKA YANG UDAH COBA 🌟</h2>
            <p className="text-slate-400 font-medium text-xs md:text-sm">Ratusan pack terjual setiap bulannya!</p>
          </div>

          <div 
            ref={testiScrollRef}
            className="flex overflow-x-auto flex-nowrap gap-3 md:gap-6 pb-4 md:pb-6 relative z-10" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TESTIMONIALS.map((testi, i) => (
              <div key={i} className="shrink-0 w-[80vw] md:w-[calc(33.333%-1rem)] snap-center bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 md:p-6 rounded-[20px] md:rounded-[24px] hover:bg-slate-800 transition-colors flex flex-col">
                <div className="flex gap-1 mb-2 md:mb-4">
                  {[...Array(testi.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs md:text-base text-slate-300 italic mb-4 md:mb-6 leading-relaxed flex-1">"{testi.text}"</p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-700 rounded-full mr-3 md:mr-4 border-2 border-emerald-500 overflow-hidden shrink-0">
                     <img src={testi.img} alt={testi.name} className="w-full h-full object-cover" onError={(e:any) => e.target.src = 'https://via.placeholder.com/100?text=User'}/>
                  </div>
                  <div>
                    <p className="font-black text-xs md:text-sm text-emerald-400">{testi.name}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold">Pelanggan Setia</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-2 md:gap-4 mt-1 md:mt-2 relative z-10">
             <button onClick={() => scrollTestimonials('left')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition active:scale-95 shadow-md hidden md:block border border-slate-700">
               <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
             </button>
             
             <span className="text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase bg-slate-800 px-3 py-1 md:px-4 md:py-2 rounded-full shadow-sm hidden md:inline-block">Bisa Digeser / Diklik</span>
             
             <div className="flex md:hidden items-center gap-2">
                 <ChevronLeft className="w-3 h-3 text-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase bg-slate-800 px-3 py-1 rounded-full shadow-sm">Geser ke Samping</span>
                 <ChevronRight className="w-3 h-3 text-emerald-500 animate-pulse" />
             </div>

             <button onClick={() => scrollTestimonials('right')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition active:scale-95 shadow-md hidden md:block border border-slate-700">
               <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
             </button>
          </div>
        </section>

        {/* 5. CARA PENYAJIAN */}
        <section id="penyajian" className="bg-emerald-50/50 rounded-[24px] md:rounded-[40px] p-5 md:p-12 shadow-sm border border-emerald-100 overflow-hidden relative scroll-mt-10">
          <div className="text-center mb-6 md:mb-8">
             <h2 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 text-slate-800">SARAN PENYAJIAN 👩‍🍳</h2>
             <p className="text-slate-500 font-medium text-xs md:text-sm">Anti gagal! Ikuti panduan masak ini.</p>
          </div>
          
          <div 
            id="penyajian-slider"
            className="flex flex-row flex-nowrap overflow-x-auto gap-3 md:gap-8 pb-4 md:pb-6 snap-x snap-mandatory scroll-smooth items-stretch" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="shrink-0 w-[85vw] md:w-[48%] snap-center bg-white p-5 md:p-8 rounded-[20px] md:rounded-[32px] shadow-sm border border-emerald-100 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-bl-[16px] md:rounded-bl-[24px] shadow-sm z-10">PEMPEK</div>
                <h3 className="font-black text-lg md:text-xl text-slate-800 mb-4 border-b border-slate-100 pb-3 pr-16">Cara Masak</h3>
                <div className="space-y-4 flex-1">
                    <div className="flex gap-3 md:gap-4">
                        <div className="bg-emerald-100 w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-emerald-600 shadow-inner text-xs md:text-base">1</div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-0.5 md:pt-0">Keluarkan dari freezer.</p>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                        <div className="bg-emerald-100 w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-emerald-600 shadow-inner text-xs md:text-base">2</div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-0.5 md:pt-0">Rendam sebentar hingga tidak beku (tidak perlu direbus).</p>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                        <div className="bg-emerald-100 w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-emerald-600 shadow-inner text-xs md:text-base">3</div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-0.5 md:pt-0">Goreng sebentar saja dalam minyak panas untuk menjaga tekstur tetap empuk dan rasa ikan yang kuat.</p>
                    </div>
                </div>
            </div>

            <div className="shrink-0 w-[85vw] md:w-[48%] snap-center bg-white p-5 md:p-8 rounded-[20px] md:rounded-[32px] shadow-sm border border-indigo-100 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-bl-[16px] md:rounded-bl-[24px] shadow-sm z-10">TEKWAN</div>
                <h3 className="font-black text-lg md:text-xl text-slate-800 mb-4 border-b border-slate-100 pb-3 pr-16">Cara Masak</h3>
                <div className="space-y-4 flex-1">
                    <div className="flex gap-3 md:gap-4">
                        <div className="bg-indigo-100 w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-indigo-600 shadow-inner text-xs md:text-base">1</div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-0.5 md:pt-0"><span className="font-bold text-slate-800">Rebus Kuah:</span> Didihkan 1-1,5 L air. Masukkan bumbu halus, garam, penyedap.</p>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                        <div className="bg-indigo-100 w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-indigo-600 shadow-inner text-xs md:text-base">2</div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-0.5 md:pt-0"><span className="font-bold text-slate-800">Kukus Tekwan:</span> Kukus biji tekwan & bengkoang hingga kenyal dan lembut.</p>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                        <div className="bg-indigo-100 w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-indigo-600 shadow-inner text-xs md:text-base">3</div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-0.5 md:pt-0"><span className="font-bold text-slate-800">Penyajian:</span> Tata soun & timun. Masukkan tekwan, siram kuah panas.</p>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-2 md:gap-4 mt-1 md:mt-2 relative z-10">
             <button onClick={() => document.getElementById('penyajian-slider')?.scrollBy({ left: window.innerWidth > 768 ? -400 : -300, behavior: 'smooth' })} className="p-2 bg-white rounded-full hover:bg-slate-100 transition active:scale-95 shadow-md hidden md:block border border-slate-200">
               <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
             </button>

             <div className="flex md:hidden items-center gap-2">
                 <ChevronLeft className="w-3 h-3 text-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase bg-white px-3 py-1 rounded-full shadow-sm">Geser ke Samping</span>
                 <ChevronRight className="w-3 h-3 text-emerald-500 animate-pulse" />
             </div>

             <button onClick={() => document.getElementById('penyajian-slider')?.scrollBy({ left: window.innerWidth > 768 ? 400 : 300, behavior: 'smooth' })} className="p-2 bg-white rounded-full hover:bg-slate-100 transition active:scale-95 shadow-md hidden md:block border border-slate-200">
               <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
             </button>
          </div>
        </section>

        {/* 6. LOKASI & MARKETPLACE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* LOKASI MAPS */}
          <div id="lokasi" className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-10 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center scroll-mt-10">
             <div className="mb-3 md:mb-4 transform hover:scale-110 transition-transform">
               <img src="/logo-gmaps.png" alt="Google Maps" className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-md" onError={(e:any) => e.target.src = 'https://via.placeholder.com/64?text=Maps'} />
             </div>
             <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">LOKASI KAMI</h2>
             <p className="text-xs md:text-sm text-slate-500 mb-5 md:mb-6 px-2 md:px-4">Pempek Umiwa berlokasi di Leuwigajah, Cimahi Selatan. Silakan mampir atau pesan pakai ojol!</p>
             <a href="https://maps.app.goo.gl/ex1NnDVSWVRQbGvM9" target="_blank" rel="noreferrer" className="bg-slate-900 text-white px-6 py-3 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-rose-600 transition-colors shadow-lg active:scale-95 flex items-center">
                Buka di Google Maps <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1"/>
             </a>
          </div>

          {/* LINK MARKETPLACE */}
          <div id="aplikasi" className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-10 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center scroll-mt-10">
             <div className="bg-amber-50 p-3 md:p-4 rounded-full mb-3 md:mb-4">
               <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
             </div>
             <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">PESAN VIA APLIKASI</h2>
             <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6">Nikmati promo gratis ongkir & diskon di aplikasi kesayanganmu.</p>
             <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full">
                 {/* SHOPEE */}
                 <a href="#" className="w-[47%] md:w-auto bg-white border border-slate-200 text-slate-800 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-[11px] md:text-sm flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all active:scale-95">
                    <img src="/logo-shopee.png" alt="Shopee" className="w-4 h-4 md:w-6 md:h-6 mr-1.5 md:mr-2 object-contain" onError={(e:any) => e.target.src = 'https://via.placeholder.com/24?text=S'} />
                    Shopee
                 </a>
                 
                 {/* SHOPEE FOOD */}
                 <a href="#" className="w-[47%] md:w-auto bg-white border border-slate-200 text-slate-800 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-[11px] md:text-sm flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all active:scale-95">
                    <img src="/logo-shopeefood.png" alt="ShopeeFood" className="w-4 h-4 md:w-6 md:h-6 mr-1.5 md:mr-2 object-contain" onError={(e:any) => e.target.src = 'https://via.placeholder.com/24?text=SF'} />
                    ShopeeFood
                 </a>
                 
                 {/* GOFOOD */}
                 <a href="#" className="w-[47%] md:w-auto bg-white border border-slate-200 text-slate-800 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-[11px] md:text-sm flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all active:scale-95">
                    <img src="/logo-gofood.png" alt="GoFood" className="w-4 h-4 md:w-6 md:h-6 mr-1.5 md:mr-2 object-contain" onError={(e:any) => e.target.src = 'https://via.placeholder.com/24?text=GF'} />
                    GoFood
                 </a>
                 
                 {/* GRABFOOD */}
                 <a href="https://r.grab.com/o/iU3miUnm" className="w-[47%] md:w-auto bg-white border border-slate-200 text-slate-800 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-[11px] md:text-sm flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all active:scale-95">
                    <img src="/logo-grabfood.png" alt="GrabFood" className="w-4 h-4 md:w-6 md:h-6 mr-1.5 md:mr-2 object-contain" onError={(e:any) => e.target.src = 'https://via.placeholder.com/24?text=Gr'} />
                    GrabFood
                 </a>
                 
                 {/* TIKTOK SHOP */}
                 <a href="https://vt.tiktok.com/ZSxmwuCpD/?page=Mall" className="w-full md:w-auto bg-white border border-slate-200 text-slate-800 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-[11px] md:text-sm flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all active:scale-95">
                    <img src="/logo-tiktokshop.png" alt="TikTok Shop" className="w-4 h-4 md:w-6 md:h-6 mr-1.5 md:mr-2 object-contain" onError={(e:any) => e.target.src = 'https://via.placeholder.com/24?text=TK'} />
                    TikTok Shop
                 </a>
             </div>
          </div>
        </section>

        {/* 7. PEMBAYARAN & QRIS */}
        <section id="qris" className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-12 text-center border border-slate-200 shadow-sm scroll-mt-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl md:text-3xl font-black text-slate-800 mb-2 md:mb-4 flex items-center justify-center"><CreditCard className="w-5 h-5 md:w-8 md:h-8 mr-2 md:mr-3 text-indigo-500"/> PEMBAYARAN VIA QRIS</h2>
            <p className="text-xs md:text-base text-slate-500 mb-6 md:mb-8">Scan barcode di bawah menggunakan M-Banking atau E-Wallet apa saja.</p>
            
            <div className="inline-block p-4 md:p-8 bg-slate-50 rounded-[20px] md:rounded-[32px] border-2 border-dashed border-slate-300 mb-5 md:mb-6">
              <img src="/qris-umiwa.jpg" alt="QRIS Pempek Umiwa" className="w-48 h-48 md:w-80 md:h-80 object-contain rounded-xl shadow-sm bg-white" onError={(e:any) => e.target.src = 'https://via.placeholder.com/500x500?text=Gambar+QRIS+Umiwa'} />
            </div>
            
            <p className="text-[10px] md:text-sm font-black text-slate-400 tracking-widest uppercase mb-2">A/N PEMPEK UMIWA</p>
            <div className="bg-indigo-50 border border-indigo-100 inline-block px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-full text-indigo-700">
               <p className="text-[10px] md:text-sm font-bold">💡 Tahan gambarnya lalu pilih <b>"Save / Download Image"</b> untuk disimpan kTahan e HP.</p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER DENGAN SOSIAL MEDIA */}
      <footer id="sosmed" className="mt-12 md:mt-20 pt-12 md:pt-16 pb-6 md:pb-10 bg-slate-900 text-slate-400 text-center text-sm rounded-t-[32px] md:rounded-t-[40px] relative overflow-hidden scroll-mt-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-rose-500 to-indigo-500"></div>
        <div className="absolute -right-20 -top-20 opacity-5 blur-sm"><Flame className="w-48 h-48 md:w-64 md:h-64" /></div>

        <div className="max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h3 className="text-white font-black text-xl md:text-3xl mb-2 md:mb-3 tracking-tight">JADILAH BAGIAN DARI KELUARGA UMIWA!</h3>
          <p className="text-slate-400 mb-6 md:mb-10 max-w-md mx-auto text-xs md:text-sm leading-relaxed">
            Follow sosial media kami untuk update promo gila-gilaan, giveaway, dan konten seru setiap harinya!
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
             <a href="https://www.tiktok.com/@pempek.umiwa" className="bg-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center border border-slate-700 hover:border-slate-400">
                <img src="/icon-tiktok.png" alt="TikTok" className="h-6 md:h-10 w-auto object-contain transition-all" onError={(e:any) => e.target.src = 'https://via.placeholder.com/32?text=TK'} />
             </a>
             
             <a href="https://www.instagram.com/pempekumiwa_?igsh=NzU1M20ycnJreGk5&utm_source=qr" className="bg-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center border border-slate-700 hover:border-rose-500">
                <img src="/icon-instagram.png" alt="Instagram" className="h-6 md:h-10 w-auto object-contain transition-all" onError={(e:any) => e.target.src = 'https://via.placeholder.com/32?text=IG'} />
             </a>

             <a href="https://youtube.com/@pempekumiwa?si=XpN1PL7PZ2uDNXXW" className="bg-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center border border-slate-700 hover:border-red-500">
                <img src="/icon-youtube.png" alt="YouTube" className="h-6 md:h-10 w-auto object-contain transition-all" onError={(e:any) => e.target.src = 'https://via.placeholder.com/32?text=YT'} />
             </a>

             <a href="#" className="bg-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center border border-slate-700 hover:border-slate-400">
                <img src="/icon-x.png" alt="X" className="h-6 md:h-10 w-auto object-contain transition-all" onError={(e:any) => e.target.src = 'https://via.placeholder.com/32?text=X'} />
             </a>

             <a href="https://www.threads.com/@pempekumiwa_?igshid=NTc4MTIwNjQ2YQ==" className="bg-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center border border-slate-700 hover:border-slate-400">
                <img src="/icon-threads.png" alt="Threads" className="h-6 md:h-10 w-auto object-contain transition-all" onError={(e:any) => e.target.src = 'https://via.placeholder.com/32?text=TH'} />
             </a>
          </div>
          
          <div className="border-t border-slate-800 pt-5 md:pt-8">
             <p className="font-bold text-[10px] md:text-xs text-slate-500">© {new Date().getFullYear()} Pempek Umiwa. 100% Tenggiri Asli.</p>
          </div>
        </div>
      </footer>

      {/* ================================================== */}
      {/* FLOATING CART BUTTON */}
      {/* ================================================== */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 md:bottom-6 left-0 right-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom-10">
          <button onClick={() => setIsCartOpen(true)} className="bg-emerald-600 text-white w-full max-w-lg p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[0_15px_40px_rgba(5,150,105,0.4)] flex justify-between items-center active:scale-95 border border-emerald-500">
            <div className="flex items-center">
              <div className="bg-white/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 relative">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] md:text-[11px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-emerald-600">{totalItems}</span>
              </div>
              <div className="text-left">
                <p className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase tracking-widest leading-none">Keranjang</p>
                <p className="text-base md:text-lg font-black leading-tight mt-0.5">{formatIDR(totalCart)}</p>
              </div>
            </div>
            <span className="font-black text-xs md:text-sm bg-white text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center">LIHAT <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" /></span>
          </button>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL GALERI PRODUK POP-UP (GAMBAR & VIDEO) */}
      {/* ================================================== */}
      {galleryOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl flex flex-col items-center">
            
            {/* Tombol Close Responsif: Di pojok kanan atas layar pada HP, di luar kotak pada PC */}
            <button onClick={() => setGalleryOpen(false)} className="absolute top-4 right-4 md:-top-12 md:right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-md z-30">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <h2 className="text-white text-lg md:text-2xl font-black mb-3 md:mb-4 tracking-wide text-center px-4">{selectedProduct.name}</h2>

            {/* KONTEN MEDIA UTAMA: Full Edge-to-edge di HP, Aspek Rasio Otomatis Berubah jika Gambar/Video */}
            <div className={`w-full bg-black md:rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center border-y md:border border-slate-800/50 ${
              selectedProduct.media?.[activeMediaIndex]?.type === 'video'
                ? 'aspect-[9/16] max-h-[72vh] md:max-h-none md:aspect-video'
                : 'aspect-square md:aspect-[16/9]'
            }`}>
              
              {selectedProduct.media && selectedProduct.media.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); prevMedia(); }} className="absolute left-2 md:left-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all">
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}

              {selectedProduct.media && selectedProduct.media.length > 0 ? (
                selectedProduct.media[activeMediaIndex].type === 'video' ? (
                  <div 
                    className="w-full h-full absolute inset-0 bg-black [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:border-0"
                    dangerouslySetInnerHTML={{ __html: selectedProduct.media[activeMediaIndex].embedCode }}
                  />
                ) : (
                  <img src={selectedProduct.media[activeMediaIndex].url} alt="Gallery" className="w-full h-full object-contain" />
                )
              ) : (
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-contain" />
              )}

              {selectedProduct.media && selectedProduct.media.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); nextMedia(); }} className="absolute right-2 md:right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>

            {/* THUMBNAIL PILIHAN DI BAWAHNYA */}
            {selectedProduct.media && selectedProduct.media.length > 1 && (
              <div className="flex gap-3 mt-4 md:mt-6 overflow-x-auto w-full justify-center px-4 py-1 scrollbar-hide">
                {selectedProduct.media.map((med: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeMediaIndex === idx ? 'border-emerald-500 scale-110 opacity-100 shadow-[0_0_15px_rgba(5,150,105,0.5)]' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  >
                    {med.type === 'video' ? (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                      </div>
                    ) : (
                      <img src={med.url} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Teks Deskripsi Bawah Sudah Dihapus Sesuai Request */}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL CHECKOUT & FORM PEMBELI */}
      {/* ================================================== */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end p-0 cursor-pointer"
          onClick={() => setIsCartOpen(false)} 
        >
          <div 
            className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-t-[32px] rounded-b-none h-[85vh] md:max-h-[90vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-full duration-300 overflow-hidden cursor-default mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* === AREA SENSOR SWIPE / TARIK (HANYA DI BAGIAN ATAS KEPALA KERANJANG) === */}
            <div 
              className="shrink-0 cursor-grab active:cursor-grabbing bg-white relative z-10"
              // 1. Sensor untuk HP (Layar Sentuh)
              onTouchStart={(e) => touchStartY.current = e.touches[0].clientY}
              onTouchEnd={(e) => {
                if (e.changedTouches[0].clientY - touchStartY.current > 50) setIsCartOpen(false);
              }}
              // 2. Sensor untuk Laptop/PC (Tarikan Mouse)
              onMouseDown={(e) => touchStartY.current = e.clientY}
              onMouseUp={(e) => {
                if (e.clientY - touchStartY.current > 50) setIsCartOpen(false);
              }}
            >
              {/* Indikator Garis Tarik */}
              <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
              </div>

              {/* Judul Keranjang */}
              <div className="p-4 pt-2 md:p-6 md:pt-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-black text-lg md:text-xl text-slate-800 flex items-center">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2 text-emerald-500"/> Keranjang Belanja
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="bg-slate-100 p-1.5 md:p-2 rounded-full hover:bg-rose-100 hover:text-rose-600 transition">
                  <X className="w-4 h-4 md:w-5 md:h-5"/>
                </button>
              </div>
            </div>
            {/* ========================================================= */}

            {/* AREA KONTEN DAFTAR MENU (Aman di-scroll ke bawah) */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {cart.length === 0 ? (
                <div className="text-center py-8 md:py-10 flex flex-col items-center">
                  <div className="bg-slate-100 p-3 md:p-4 rounded-full mb-3 md:mb-4"><ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-slate-300"/></div>
                  <p className="text-slate-400 font-bold text-sm">Keranjang masih kosong.</p>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">Yuk pilih paket pempek favorit kamu!</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {cart.map((c, i) => (
                    <div key={i} className="flex bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 items-center">
                       <img src={c.img} className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl object-cover bg-slate-100 mr-3 md:mr-4" alt={c.name} onError={(e:any) => e.target.src = 'https://via.placeholder.com/100?text=Foto'}/>
                       <div className="flex-1">
                          <p className="text-xs md:text-sm font-black text-slate-800 leading-tight">{c.name}</p>
                          <p className="text-[10px] md:text-xs font-bold text-emerald-600 mt-0.5 md:mt-1">{formatIDR(c.price)}</p>
                       </div>
                       
                       <div className="flex items-center bg-slate-50 rounded-lg md:rounded-xl p-1 border border-slate-200 ml-2 shrink-0">
                          <button onClick={() => updateQty(c.name, -1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-slate-500 font-black">-</button>
                          <span className="w-6 md:w-8 text-center text-xs md:text-sm font-black text-slate-800">{c.qty}</span>
                          <button onClick={() => updateQty(c.name, 1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-slate-500 font-black">+</button>
                       </div>

                       {/* === TOMBOL HAPUS DITARUH DI SINI === */}
                       <button 
                         onClick={() => setCart(cart.filter(item => item.name !== c.name))} 
                         className="ml-2 md:ml-3 p-1.5 md:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg md:rounded-xl transition-colors active:scale-95 shrink-0"
                         title="Hapus dari keranjang"
                       >
                         <X className="w-4 h-4 md:w-5 md:h-5" />
                       </button>

                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-slate-200 shadow-sm space-y-3 md:space-y-4">
                  <h3 className="font-black text-[10px] md:text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 md:pb-3">Data Pemesan & Pengiriman</h3>
                  
                  <div>
                    <input type="text" required value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="Nama Lengkap (Cth: Rina Mawar)" className="w-full p-2.5 md:p-3.5 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-slate-800 placeholder:text-[12px] md:placeholder:text-xs placeholder:text-slate-400/60 placeholder:font-bold outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <input type="tel" required value={custPhone} onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-'))} placeholder="No. WhatsApp (Cth: 0812-3456-7890)" className="w-full p-2.5 md:p-3.5 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-slate-800 placeholder:text-[12px] md:placeholder:text-xs placeholder:text-slate-400/60 placeholder:font-bold outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                  </div>

                  {/* TOGGLE PENGIRIMAN */}
                  <div className="pt-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase block mb-1.5 md:mb-2">Pengiriman</label>
                    <div className="flex gap-2 md:gap-3">
                      <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer ${deliveryMode === 'pickup' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white text-slate-500'}`}>
                        <input type="radio" className="hidden" checked={deliveryMode === 'pickup'} onChange={() => setDeliveryMode('pickup')} />
                        🏪 Ambil Sendiri
                      </label>
                      
                      <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer ${deliveryMode === 'delivery' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white text-slate-500'}`}>
                        <input 
                          type="radio" 
                          className="hidden" 
                          checked={deliveryMode === 'delivery'} 
                          onChange={() => {
                            setDeliveryMode('delivery');
                            // Delay sedikit agar menu dirender dulu, baru di-scroll
                            setTimeout(() => {
                              document.getElementById('kurir-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 150);
                          }} 
                        />
                        🛵 Dikirim
                      </label>
                    </div>
                  </div>

                  {/* OPSI KURIR JIKA DIKIRIM */}
                  {deliveryMode === 'delivery' && (
                    <div id="kurir-section" className="mt-3 md:mt-4 space-y-2 md:space-y-3 animate-in slide-in-from-top-2">
                        <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase block mb-1">Pilih Kurir</label>
                        
                        {/* 1. AHSAN XPRESS */}
                        <label className={`block p-2.5 md:p-3 border rounded-lg md:rounded-xl cursor-pointer transition-all ${courier === 'ahsan' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                          <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                            <input type="radio" className="hidden" checked={courier === 'ahsan'} onChange={() => setCourier('ahsan')} />
                            <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 mr-2 flex items-center justify-center shrink-0 ${courier === 'ahsan' ? 'border-emerald-500' : 'border-slate-300'}`}>
                              {courier === 'ahsan' && <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>}
                            </span>
                            <span className="font-bold text-[11px] md:text-sm text-slate-800 mr-2">Ahsan Xpress - Sameday (Rp 12rb)</span>
                            {/* BADGE HIGHLIGHT */}
                            <span className="bg-sky-100 text-sky-700 border border-sky-200 px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-wider">📍 Se-Bandung Raya</span>
                          </div>
                          <p className="text-[11px] md:text-xs font-normal text-slate-600 pl-5 md:pl-6 leading-relaxed">
                            Ongkir flat untuk area <b className="text-slate-700">Kota Bandung, Cimahi, Kab. Bandung, KBB, & sebagian Sumedang</b>. Order masuk maksimal jam 10 pagi, lebih dari itu diproses besok. 
                            Pengiriman ke alamat tujuan mulai jam 15.00 sampai selesai.
                          </p>
                        </label>

                        {/* 2. KURIR UMIWA (DILENGKAPI SAKLAR) */}
                        {IS_KURIR_UMIWA_AKTIF && (
                          <label className={`block p-2.5 md:p-3 border rounded-lg md:rounded-xl cursor-pointer transition-all ${courier === 'umiwa' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                            <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                              <input type="radio" className="hidden" checked={courier === 'umiwa'} onChange={() => setCourier('umiwa')} />
                              <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 mr-2 flex items-center justify-center shrink-0 ${courier === 'umiwa' ? 'border-emerald-500' : 'border-slate-300'}`}>
                                {courier === 'umiwa' && <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>}
                              </span>
                              <span className="font-bold text-[11px] md:text-sm text-slate-800 mr-2">Kurir Umiwa - Instant (Rp 9rb)</span>
                              {/* BADGE HIGHLIGHT */}
                              <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-wider">🛵 Khusus Cimahi</span>
                            </div>
                            <p className="text-[11px] md:text-xs font-normal text-slate-600 pl-5 md:pl-6 leading-relaxed">
                              Pesanan diantar langsung ke tempat tujuan oleh kurir dari Pempek Umiwa, <b className="text-slate-700">berlaku khusus area Cimahi saja</b>.
                            </p>
                          </label>
                        )}

                        {/* 3. PAXEL */}
                        <label className={`block p-2.5 md:p-3 border rounded-lg md:rounded-xl cursor-pointer transition-all ${courier === 'paxel' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                          <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                            <input type="radio" className="hidden" checked={courier === 'paxel'} onChange={() => setCourier('paxel')} />
                            <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 mr-2 flex items-center justify-center shrink-0 ${courier === 'paxel' ? 'border-emerald-500' : 'border-slate-300'}`}>
                              {courier === 'paxel' && <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>}
                            </span>
                            <span className="font-bold text-[11px] md:text-sm text-slate-800 mr-2">Paxel (Luar Kota)</span>
                            {/* BADGE HIGHLIGHT */}
                            <span className="bg-purple-100 text-purple-700 border border-purple-200 px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-wider">✈️ Luar Bandung Raya</span>
                          </div>
                          <p className="text-[11px] md:text-xs font-normal text-slate-600 pl-5 md:pl-6 leading-relaxed">
                            Pengiriman dengan fasilitas pendingin <b className="text-slate-700">khusus untuk luar kota / luar pulau</b>. Ongkir fix diinfokan Admin via WhatsApp.
                          </p>
                        </label>

                        {/* 4. GOSEND / GRAB */}
                        <label className={`block p-2.5 md:p-3 border rounded-lg md:rounded-xl cursor-pointer transition-all ${courier === 'gosend' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                          <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                            <input type="radio" className="hidden" checked={courier === 'gosend'} onChange={() => setCourier('gosend')} />
                            <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 mr-2 flex items-center justify-center shrink-0 ${courier === 'gosend' ? 'border-emerald-500' : 'border-slate-300'}`}>
                              {courier === 'gosend' && <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>}
                            </span>
                            <span className="font-bold text-[11px] md:text-sm text-slate-800 mr-2">Gosend/Shopee Instant</span>
                            {/* BADGE HIGHLIGHT */}
                            <span className="bg-amber-100 text-amber-700 border border-amber-200 px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-wider">📱 Pesan Sendiri</span>
                          </div>
                          <p className="text-[11px] md:text-xs font-normal text-slate-600 pl-5 md:pl-6 leading-relaxed">
                            Konsumen <b className="text-slate-700">memesan kurir ojol sendiri</b> ke titik lokasi kami setelah pesanan kami konfirmasi siap diambil.
                          </p>
                        </label>

                        {/* FORM ALAMAT */}
                        {(courier === 'ahsan' || courier === 'umiwa' || courier === 'paxel') && (
                          <div className="bg-slate-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-200 space-y-2.5 md:space-y-3 mt-2 md:mt-4">
                            
                            <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1.5 md:pb-2">
                              Alamat Pengiriman
                            </p>

                            <div>
                              <input
                                type="text"
                                required
                                placeholder="Nama Jalan, No Rumah, Blok, RT/RW"
                                value={address.jalan}
                                onChange={e=>setAddress({...address, jalan: e.target.value})}
                                className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-800 placeholder:text-[12px] md:placeholder:text-xs placeholder:text-slate-400/60 placeholder:font-bold outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:gap-3">
                              <input
                                type="text"
                                required
                                placeholder="Kelurahan / Desa"
                                value={address.kelurahan}
                                onChange={e=>setAddress({...address, kelurahan: e.target.value})}
                                className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-800 placeholder:text-[12px] md:placeholder:text-xs placeholder:text-slate-400/60 placeholder:font-bold outline-none focus:border-emerald-500"
                              />

                              <input
                                type="text"
                                required
                                placeholder="Kecamatan"
                                value={address.kecamatan}
                                onChange={e=>setAddress({...address, kecamatan: e.target.value})}
                                className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-800 placeholder:text-[12px] md:placeholder:text-xs placeholder:text-slate-400/60 placeholder:font-bold outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div>
                              <input
                                type="text"
                                required
                                placeholder="Kabupaten / Kota"
                                value={address.kota}
                                onChange={e=>setAddress({...address, kota: e.target.value})}
                                className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-800 placeholder:text-[12px] md:placeholder:text-xs placeholder:text-slate-400/60 placeholder:font-bold outline-none focus:border-emerald-500"
                              />
                            </div>

                          </div>
                        )}
                    </div>
                  )}

                  {/* METODE PEMBAYARAN */}
                  <div className="pt-2">
                    <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase block mb-1.5 md:mb-2">
                      Metode Pembayaran
                    </label>

                    <div className="flex gap-2 md:gap-3">

                      {/* QRIS */}
                      <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${paymentMethod === 'qris' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                        
                        <input
                          type="radio"
                          className="hidden"
                          checked={paymentMethod === 'qris'}
                          onChange={() => setPaymentMethod('qris')}
                        />

                        <div className="h-7 md:h-8 flex items-center justify-center mb-1">
                          <img
                            src="/logo-qris.png"
                            alt="QRIS"
                            className="max-h-full max-w-[52px] object-contain"
                          />
                        </div>

                        QRIS
                      </label>

                      {/* BSI */}
                      <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${paymentMethod === 'bsi' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                        
                        <input
                          type="radio"
                          className="hidden"
                          checked={paymentMethod === 'bsi'}
                          onChange={() => setPaymentMethod('bsi')}
                        />

                        <div className="h-7 md:h-8 flex items-center justify-center mb-1">
                          <img
                            src="/logo-bsi.png"
                            alt="BSI"
                            className="max-h-full max-w-[52px] object-contain"
                          />
                        </div>

                        Transfer BSI
                      </label>

                      {/* CASH (HANYA MUNCUL JIKA AMBIL SENDIRI ATAU PAKAI KURIR UMIWA) */}
                      {(deliveryMode === 'pickup' || (deliveryMode === 'delivery' && courier === 'umiwa')) && (
                        <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${paymentMethod === 'cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                          
                          <input
                            type="radio"
                            className="hidden"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                          />

                          <div className="h-7 md:h-8 flex items-center justify-center mb-1">
                            <img
                              src="/logo-duit.png"
                              alt="Duit"
                              className="max-h-full max-w-[52px] object-contain"
                            />
                          </div>

                          Cash / Tunai
                        </label>
                      )}

                    </div>
                  </div>

                  {/* TAMBAHAN PACKING (DISEMBUNYIKAN JIKA PILIH PAXEL) */}
                  {!(deliveryMode === 'delivery' && courier === 'paxel') && (
                    <div className="pt-2">
                      <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase block mb-1">Gunakan Thermal Packing?</label>
                      
                      {/* ... (Seluruh isi tombol thermal pouch & cooler bag Bos biarkan tetap di sini) ... */}
                      <p className="text-[10px] md:text-xs text-slate-400 mb-2.5 leading-relaxed">
                        Berfungsi menjaga pempek frozen tetap dingin, beku, dan fresh selama pengiriman.
                      </p>
                      
                      <div className="flex gap-2 md:gap-3">
                        <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer transition-colors ${addPacking === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            className="hidden" 
                            checked={addPacking === true} 
                            onChange={() => {
                              setAddPacking(true);
                              setTimeout(() => {
                                document.getElementById('packing-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 150);
                            }} 
                          />
                          📦 Ya
                        </label>

                        <label className={`flex-1 p-2 md:p-3 border rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-center cursor-pointer transition-colors ${addPacking === false ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                          <input type="radio" className="hidden" checked={addPacking === false} onChange={() => setAddPacking(false)} />
                          ❌ Tidak
                        </label>
                      </div>

                      {/* SUB-MENU PILIHAN PACKING */}
                      {addPacking && (
                        <div id="packing-section" className="mt-3 grid grid-cols-2 gap-2 md:gap-3 animate-in slide-in-from-top-2">
                          
                          {/* Pilihan 1: POUCH */}
                          <label className={`border rounded-lg md:rounded-xl p-3 cursor-pointer flex flex-col items-center text-center transition-all ${packingOption === 'pouch' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                            <input type="radio" className="hidden" checked={packingOption === 'pouch'} onChange={() => setPackingOption('pouch')} />
                            <img src="/foto-pouch.jpg" alt="Thermal Pouch" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mb-2 bg-slate-100" onError={(e:any) => e.target.src = 'https://via.placeholder.com/80?text=Foto+Pouch'} />
                            <span className="text-[10px] md:text-xs font-bold text-slate-800 leading-tight">Thermal Pouch</span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 mt-0.5">Maksimal muat untuk 2 pack</span>
                            <span className="text-[9px] md:text-[10px] font-black text-emerald-600 mt-1">+ Rp 2.500</span>
                          </label>
                          
                          {/* Pilihan 2: COOLER BAG */}
                          <label className={`border rounded-lg md:rounded-xl p-3 cursor-pointer flex flex-col items-center text-center transition-all ${packingOption === 'cooler' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                            <input type="radio" className="hidden" checked={packingOption === 'cooler'} onChange={() => setPackingOption('cooler')} />
                            <img src="/foto-cooler.jpg" alt="Thermal Cooler Bag" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mb-2 bg-slate-100" onError={(e:any) => e.target.src = 'https://via.placeholder.com/80?text=Foto+Cooler'} />
                            <span className="text-[10px] md:text-xs font-bold text-slate-800 leading-tight">Thermal Cooler Bag</span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 mt-0.5">Maksimal muat untuk 5 pack</span>
                            <span className="text-[9px] md:text-[10px] font-black text-emerald-600 mt-1">+ Rp 3.000</span>
                          </label>

                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Footer Total & Tombol WA */}
            {cart.length > 0 && (
              <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0 pb-6 md:pb-6">
                
                <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4 border-b border-slate-100 pb-3 md:pb-4">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] md:text-xs text-slate-500 font-medium">Subtotal</span>
                     <span className="text-[10px] md:text-xs font-bold text-slate-800">{formatIDR(totalCart)}</span>
                   </div>
                   {deliveryMode === 'delivery' && shippingFee > 0 && (
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] md:text-xs text-slate-500 font-medium">Ongkir</span>
                       <span className="text-[10px] md:text-xs font-bold text-slate-800">{formatIDR(shippingFee)}</span>
                     </div>
                   )}
                   
                   {/* UBAH BAGIAN INI AGAR PACKING PAXEL IKUT MUNCUL */}
                   {(addPacking || (deliveryMode === 'delivery' && courier === 'paxel')) && (
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] md:text-xs text-slate-500 font-medium">
                         {deliveryMode === 'delivery' && courier === 'paxel' ? 'Packing Khusus (Paxel)' : 'Packing'}
                       </span>
                       <span className="text-[10px] md:text-xs font-bold text-slate-800">{formatIDR(packingFee)}</span>
                     </div>
                   )}
                </div>

                <div className="flex justify-between items-start mb-4 md:mb-5 border-t border-slate-100 pt-4">
                  <span className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest pt-1">Grand Total</span>
                  <div className="text-right flex flex-col items-end">
                     {/* Harga Utama tetap Emerald */}
                     <span className="text-2xl md:text-3xl font-black text-emerald-600 block leading-none">{formatIDR(grandTotal)}</span>
                     
                     {/* === INFO PAXEL YANG DI-HIGHLIGHT TOTAL === */}
                     {deliveryMode === 'delivery' && courier === 'paxel' && (
                        <div className="mt-2.5 bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 rounded-xl shadow-inner animate-pulse flex items-center gap-2">
                          {/* Icon Peringatan */}
                          <Info className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-rose-500" />
                          
                          <div className="text-left">
                            <span className="text-[10px] md:text-[12px] font-black block leading-tight uppercase tracking-wider">
                              + ONGKIR PAXEL VIA WA
                            </span>
                            <span className="text-[9px] md:text-[11px] font-medium block text-rose-600/90 leading-tight">
                              Nanti ditotalin Admin di WhatsApp ya kak.
                            </span>
                          </div>
                        </div>
                     )}
                     {/* ========================================= */}
                  </div>
                </div>
                <button onClick={handleCheckoutWA} className="w-full bg-[#25D366] text-white font-black py-3.5 md:py-5 rounded-xl md:rounded-2xl flex justify-center items-center active:scale-95 shadow-md text-xs md:text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.638-1.653-1.935-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  PESAN VIA WHATSAPP
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}

    </div>
  );
}