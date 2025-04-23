// lib/data.js
const categories = [
  {
    name: 'Vintage Plates',
    slug: 'vintage-plates',
    redirect: '/collections/vintage-plates',
    img: 'https://unsplash.it/600/800?image=1073',
    banner: 'https://unsplash.it/1200/400?image=1073',
    count: '120+ Styles',
    products: [
      {
        name: '1960s Pressed Steel',
        slug: '1960s-pressed-steel',
        price: '£189',
        image: 'https://unsplash.it/600/800?image=1073',
        description:
          'Authentic 1960s pressed steel plates, capturing the essence of vintage motoring. These durable plates feature period-correct fonts and styling, perfect for classic car enthusiasts and collectors.',
        options: [
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Classic Raised Aluminium',
        slug: 'classic-raised-aluminium',
        price: '£249',
        image: 'https://unsplash.it/600/800?image=119',
        description:
          'Elegant raised aluminium plates with a timeless design. Hand-crafted using traditional methods, these plates offer a premium look and feel, ideal for vintage and luxury vehicles.',
        options: [
          {
            type: 'box selector',
            name: 'Select Background Finish',
            options: ['Matte', 'Glossy', 'Brushed'],
          },
          {
            type: 'inline selector',
            name: 'Select Text Colour',
            options: ['Black', 'Silver', 'Gold'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Heritage Black/Silver',
        slug: 'heritage-black-silver',
        price: '£299',
        image: 'https://unsplash.it/600/800?image=120',
        description:
          'Striking black and silver heritage plates, combining modern durability with classic aesthetics. These plates feature a UV-resistant finish and are perfect for adding a touch of nostalgia to any vehicle.',
        options: [
          {
            type: 'box selector',
            name: 'Select Plate Style',
            options: ['Standard', 'Curved', 'Beveled'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Size',
            options: ['Standard', 'Oversized', 'Compact'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Retro Revival',
        slug: 'retro-revival',
        price: '£199',
        image: 'https://unsplash.it/600/800?image=1074',
        description:
          'Modern plates with a retro twist, featuring iconic designs from various decades. These plates are made with eco-friendly materials and offer a unique way to customize your vehicle with vintage charm.',
        options: [
          {
            type: 'box selector',
            name: 'Select Retro Theme',
            options: ['1970s', '1980s', '1990s'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Shape',
            options: ['Rectangle', 'Square', 'Rounded'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
    ],
  },
  {
    name: 'Personalized Series',
    slug: 'personalized-series',
    redirect: '/collections/personalized-series',
    img: 'https://unsplash.it/600/800?image=1074',
    banner: 'https://unsplash.it/1200/400?image=1074',
    count: 'Custom Designs',
    products: [
      {
        name: 'Custom Initial Plates',
        slug: 'custom-initial-plates',
        price: '£399',
        image: 'https://images.unsplash.com/photo-1715066289859-d12a3b4eb28d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bnVtYmVycGxhdGV8ZW58MHx8MHx8fDA%3D',
        description:
          'Personalized plates featuring your initials in a range of stylish fonts and designs. Made with premium materials, these plates allow you to add a personal touch to your vehicle.',
        options: [
          {
            type: 'box selector',
            name: 'Select Font',
            options: ['Serif', 'Sans-Serif', 'Script'],
          },
          {
            type: 'inline selector',
            name: 'Select Initial Colour',
            options: ['Black', 'White', 'Custom'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Desired Design Template',
          },
        ],
      },
      {
        name: 'VIP Name Plates',
        slug: 'vip-name-plates',
        price: '£599',
        image: 'https://images.unsplash.com/photo-1675960690207-f443ff1c31f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG51bWJlcnBsYXRlfGVufDB8fDB8fHww',
        description:
          'Exclusive VIP plates showcasing your full name or chosen text. Crafted with luxurious materials and finishes, these plates make a bold statement and are perfect for high-end vehicles.',
        options: [
          {
            type: 'box selector',
            name: 'Select Material',
            options: ['Gold Plated', 'Silver Plated', 'Platinum'],
          },
          {
            type: 'inline selector',
            name: 'Select Text Alignment',
            options: ['Left', 'Center', 'Right'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Business Branded',
        slug: 'business-branded',
        price: '£499',
        image: 'https://images.unsplash.com/photo-1622300896044-e26a911ca3db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG51bWJlcnBsYXRlfGVufDB8fDB8fHww',
        description:
          'Custom plates featuring your business logo and branding. These high-quality plates are designed to promote your company while maintaining a professional and stylish appearance on company vehicles.',
        options: [
          {
            type: 'box selector',
            name: 'Select Plate Background',
            options: ['Solid Colour', 'Gradient', 'Texture'],
          },
          {
            type: 'inline selector',
            name: 'Select Logo Position',
            options: ['Top', 'Center', 'Bottom'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Company Logo',
          },
        ],
      },
      {
        name: '2D Printed Custom',
        slug: '2d-printed-custom',
        price: '£350',
        image: 'https://images.unsplash.com/photo-1631453494181-f762d692583a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description:
          'Versatile 2D printed custom plates offering endless design possibilities. Create unique plates with graphics, patterns, or text of your choice, printed using advanced UV-resistant inks for long-lasting results.',
        options: [
          {
            type: 'box selector',
            name: 'Select Print Finish',
            options: ['Matte', 'Glossy', 'Satin'],
          },
          {
            type: 'box selector',
            name: 'Select Print Finishs',
            options: ['Matte', 'Glossy', 'Satin'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Border',
            options: ['None', 'Thin', 'Thick'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Design File',
          },
        ],
      },
    ],
  },
  {
    name: 'Luxury Editions',
    slug: 'luxury-editions',
    redirect: '/collections/luxury-editions',
    img: 'https://unsplash.it/600/800?image=1075',
    banner: 'https://unsplash.it/1200/400?image=1075',
    count: '24k Gold Trim',
    products: [
      {
        name: '24K Gold Trim Plate',
        slug: '24k-gold-trim',
        price: '£999',
        image: 'https://unsplash.it/600/800?image=124',
        description:
          'Exquisite plates featuring genuine 24K gold trim. Each plate is meticulously crafted to add a touch of opulence to your vehicle, perfect for luxury car owners seeking the ultimate in automotive accessories.',
        options: [
          {
            type: 'box selector',
            name: 'Select Plate Shape',
            options: ['Rectangle', 'Oval', 'Custom'],
          },
          {
            type: 'inline selector',
            name: 'Select Gold Purity',
            options: ['24K', '18K', '14K'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Design Preferences',
          },
        ],
      },
      {
        name: 'Carbon Fiber Elite',
        slug: 'carbon-fiber-elite',
        price: '£799',
        image: 'https://unsplash.it/600/800?image=125',
        description:
          'High-tech carbon fiber plates combining lightweight durability with sleek aesthetics. These plates offer a premium, sporty look ideal for performance vehicles and car enthusiasts who appreciate cutting-edge materials.',
        options: [
          {
            type: 'box selector',
            name: 'Select Carbon Fiber Finish',
            options: ['Matte', 'Glossy', 'Textured'],
          },
          {
            type: 'inline selector',
            name: 'Select Accent Colour',
            options: ['Red', 'Blue', 'Silver'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Platinum Series',
        slug: 'platinum-series',
        price: '£1,499',
        image: 'https://unsplash.it/600/800?image=126',
        description:
          'Ultra-premium plates crafted with platinum-infused materials. These exclusive plates offer unparalleled luxury and durability, designed for those who demand the very best for their high-end vehicles.',
        options: [
          {
            type: 'box selector',
            name: 'Select Base Material',
            options: ['Platinum', 'Palladium', 'White Gold'],
          },
          {
            type: 'inline selector',
            name: 'Select Engraving Style',
            options: ['Classic', 'Modern', 'Ornate'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: '3D Sculpted Luxury',
        slug: '3d-sculpted-luxury',
        price: '£1,299',
        image: 'https://unsplash.it/600/800?image=127',
        description:
          'Innovative 3D sculpted plates that redefine automotive aesthetics. Each plate is a work of art, featuring intricate designs and textures that add depth and sophistication to your vehicle’s appearance.',
        options: [
          {
            type: 'box selector',
            name: 'Select Sculpture Theme',
            options: ['Abstract', 'Nature', 'Geometric'],
          },
          {
            type: 'inline selector',
            name: 'Select Lighting Options',
            options: ['LED', 'None', 'Ambient'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Sculpture Concept',
          },
        ],
      },
    ],
  },
  {
    name: 'State Specials',
    slug: 'state-specials',
    redirect: '/collections/state-specials',
    img: 'https://unsplash.it/600/800?image=1076',
    banner: 'https://unsplash.it/1200/400?image=1076',
    count: 'All 29 States',
    products: [
      {
        name: 'London Exclusive',
        slug: 'london-exclusive',
        price: '£349',
        image: 'https://unsplash.it/600/800?image=128',
        description:
          'Bespoke plates celebrating London’s iconic landmarks and culture. These plates feature unique designs that showcase the spirit of the capital, perfect for proud Londoners and city enthusiasts.',
        options: [
          {
            type: 'box selector',
            name: 'Select Landmark',
            options: ['Big Ben', 'Tower Bridge', 'Buckingham Palace'],
          },
          {
            type: 'inline selector',
            name: 'Select Background Colour',
            options: ['Red', 'Blue', 'Green'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload London Inspiration',
          },
        ],
      },
      {
        name: 'Scottish Heritage',
        slug: 'scottish-heritage',
        price: '£329',
        image: 'https://unsplash.it/600/800?image=129',
        description:
          'Plates honoring Scotland’s rich heritage and landscapes. Featuring traditional Scottish motifs and colors, these plates are ideal for those looking to display their Scottish pride on the road.',
        options: [
          {
            type: 'box selector',
            name: 'Select Tartan Pattern',
            options: ['Royal Stewart', 'Black Watch', 'Highland Pride'],
          },
          {
            type: 'inline selector',
            name: 'Select Motif Size',
            options: ['Small', 'Medium', 'Large'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Welsh Dragon',
        slug: 'welsh-dragon',
        price: '£379',
        image: 'https://unsplash.it/600/800?image=130',
        description:
          'Bold plates showcasing the iconic Welsh dragon. These eye-catching plates are perfect for Welsh nationals and supporters, featuring high-quality materials and vibrant, durable colors.',
        options: [
          {
            type: 'box selector',
            name: 'Select Dragon Style',
            options: ['Traditional', 'Modern', 'Abstract'],
          },
          {
            type: 'inline selector',
            name: 'Select Dragon Colour',
            options: ['Red', 'Gold', 'Black'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Northern Pride',
        slug: 'northern-pride',
        price: '£310',
        image: 'https://unsplash.it/600/800?image=1077',
        description:
          'Distinctive plates celebrating the spirit of Northern England. These plates feature unique designs inspired by the region’s industrial heritage and natural beauty, ideal for proud Northerners.',
        options: [
          {
            type: 'box selector',
            name: 'Select Regional Symbol',
            options: ['Rose', 'Lion', 'Castle'],
          },
          {
            type: 'inline selector',
            name: 'Select Symbol Position',
            options: ['Left', 'Center', 'Right'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Northern Inspiration',
          },
        ],
      },
    ],
  },
  {
    name: 'Commercial Vehicles',
    slug: 'commercial-vehicles',
    redirect: '/collections/commercial-vehicles',
    img: 'https://unsplash.it/600/800?image=1077',
    banner: 'https://unsplash.it/1200/400?image=1077',
    count: 'Heavy Duty',
    products: [
      {
        name: 'HGV Reflective',
        slug: 'hgv-reflective',
        price: '£199',
        image: 'https://unsplash.it/600/800?image=130',
        description:
          'High-visibility reflective plates designed for Heavy Goods Vehicles. These durable plates enhance safety and comply with all regulations, ensuring your commercial fleet stands out day and night.',
        options: [
          {
            type: 'box selector',
            name: 'Select Reflective Grade',
            options: ['Standard', 'High Intensity', 'Diamond Grade'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Colour',
            options: ['White', 'Yellow', 'Red'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Fleet Numbering',
        slug: 'fleet-numbering',
        price: '£149',
        image: 'https://unsplash.it/600/800?image=131',
        description:
          'Customizable plates with clear, bold numbering for easy fleet management. These plates are designed for durability and readability, perfect for businesses with multiple vehicles.',
        options: [
          {
            type: 'box selector',
            name: 'Select Number Font',
            options: ['Arial', 'Helvetica', 'Courier'],
          },
          {
            type: 'inline selector',
            name: 'Select Number Colour',
            options: ['Black', 'White', 'Red'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Fleet Logo',
          },
        ],
      },
      {
        name: 'Lorry Plates',
        slug: 'lorry-plates',
        price: '£179',
        image: 'https://unsplash.it/600/800?image=132',
        description:
          'Heavy-duty plates specifically designed for lorries and trucks. These plates are built to withstand harsh conditions and frequent use, ensuring your commercial vehicles always look professional.',
        options: [
          {
            type: 'box selector',
            name: 'Select Plate Material',
            options: ['Steel', 'Aluminium', 'Polycarbonate'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Thickness',
            options: ['Standard', 'Heavy Duty', 'Extra Thick'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: '3D Printed Commercial',
        slug: '3d-printed-commercial',
        price: '£220',
        image: 'https://unsplash.it/600/800?image=133',
        description:
          'Innovative 3D printed plates for commercial vehicles. These plates offer unique customization options and superior durability, allowing businesses to stand out while maintaining a professional appearance.',
        options: [
          {
            type: 'box selector',
            name: 'Select 3D Print Style',
            options: ['Raised', 'Recessed', 'Embossed'],
          },
          {
            type: 'inline selector',
            name: 'Select Infill Colour',
            options: ['Black', 'White', 'Custom'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Custom Design File',
          },
        ],
      },
    ],
  },
  {
    name: 'Collector Items',
    slug: 'collector-items',
    redirect: '/collections/collector-items',
    img: 'https://unsplash.it/600/800?image=1078',
    banner: 'https://unsplash.it/1200/400?image=1078',
    count: 'Limited Stock',
    products: [
      {
        name: 'Limited Edition 001',
        slug: 'limited-edition-001',
        price: '£2,499',
        image: 'https://unsplash.it/600/800?image=134',
        description:
          'Exclusive, numbered limited edition plates for serious collectors. Each plate is a unique piece of automotive history, featuring rare designs and premium materials. Only 100 sets ever produced.',
        options: [
          {
            type: 'box selector',
            name: 'Select Authenticity Certificate',
            options: ['Digital', 'Printed', 'None'],
          },
          {
            type: 'inline selector',
            name: 'Select Display Case',
            options: ['Included', 'Optional', 'Not Available'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload Collector Proof',
          },
        ],
      },
      {
        name: 'Vintage Rally Plate',
        slug: 'vintage-rally-plate',
        price: '£1,799',
        image: 'https://unsplash.it/600/800?image=135',
        description:
          'Authentic replica plates from iconic vintage rally events. These plates capture the spirit of classic motorsport, featuring period-correct designs and weathered finishes. A must-have for rally enthusiasts and automotive historians.',
        options: [
          {
            type: 'box selector',
            name: 'Select Rally Event',
            options: ['Monte Carlo', 'Safari', 'RAC Rally'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Condition',
            options: ['Mint', 'Good', 'Weathered'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: 'Heritage Classic',
        slug: 'heritage-classic',
        price: '£1,999',
        image: 'https://unsplash.it/600/800?image=136',
        description:
          'Meticulously crafted plates celebrating automotive heritage. Each plate is a work of art, featuring intricate details from different eras of motoring history. Perfect for classic car owners and vintage automobile aficionados.',
        options: [
          {
            type: 'box selector',
            name: 'Select Era',
            options: ['Pre-War', '1950s', '1960s'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Finish',
            options: ['Original', 'Restored', 'Replicated'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
        ],
      },
      {
        name: '3D Collector Print',
        slug: '3d-collector-print',
        price: '£1,850',
        image: 'https://unsplash.it/600/800?image=137',
        description:
          'Cutting-edge 3D printed collector plates pushing the boundaries of design. These plates feature complex, three-dimensional patterns and textures impossible to achieve with traditional methods. A true conversation piece for tech-savvy collectors.',
        options: [
          {
            type: 'box selector',
            name: 'Select 3D Print Material',
            options: ['Nylon', 'Resin', 'Metal'],
          },
          {
            type: 'inline selector',
            name: 'Select Plate Texture',
            options: ['Smooth', 'Rough', 'Detailed'],
          },
          {
            type: 'image upload',
            name: 'Upload Vehicle Registration Document',
          },
          {
            type: 'image upload',
            name: 'Upload 3D Design Inspiration',
          },
        ],
      },
    ],
  },
];

export default categories;