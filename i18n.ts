

import { Language } from './types';

export const translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      contact: 'اتصل بنا',
      liveSupport: 'الدعم المباشر',
      requestDesign: 'طلب تصميم',
      requestNew: 'طلب جديد',
      dashboard: 'تتبع الطلبات',
      adminPanel: 'لوحة المدير',
      login: 'دخول',
      register: 'تسجيل',
      logout: 'تسجيل الخروج',
      messages: 'الرسائل والتنبيهات',
      theme: 'مظهر التطبيق',
      language: 'اللغة'
    },
    hero: {
      badge: 'تصاميم من عالم آخر مدعومة من مصممين خبراء',
      titleStart: 'مرحباً بك في',
      titleEnd: 'أكاديمية فليكس',
      description: 'نأخذ أفكارك إلى بُعد جديد حيث يلتقي الفن بالتكنولوجيا لنخلق لك تجربة بصرية تسحر العيون.',
      btnStart: 'ابدأ رحلتك الآن',
      btnExplore: 'استكشف المجرات',
      btnRequest: 'تقديم طلب',
      servicesTitle: 'خدماتنا الإبداعية',
      servicesDesc: 'في فليكس ديزاين، لا نقدم مجرد تصاميم، بل نصنع تجارب بصرية متكاملة تروي قصة علامتك التجارية.',
      srvVoice: 'وكالات وبرامج صوتية',
      srvVoiceDesc: 'نصمم شعارات الوكالات، إطارات الإدارات، وشارات التميز لجميع برامج الدردشة الصوتية.',
      srvBranding: 'هوية بصرية وشعارات',
      srvBrandingDesc: 'نصمم شعارات فريدة وهويات بصرية متكاملة تعكس جوهر علامتك التجارية.',
      srvUi: 'واجهات وتجربة مستخدم',
      srvUiDesc: 'نصمم واجهات مواقع وتطبيقات تجمع بين الجمالية وسهولة الاستخدام.',
      srvSocial: 'تصاميم سوشيال ميديا',
      srvSocialDesc: 'نبتكر محتوى بصري جذاب لمنصات التواصل الاجتماعي يساعد في زيادة التفاعل.',
      srvMotion: 'موشن جرافيك ومونتاج',
      srvMotionDesc: 'نحول الأفكار الجامدة إلى فيديوهات متحركة مبهرة توصل رسالتك بشكل ديناميكي.',
      noBanners: 'لا توجد بنرات نشطة حالياً'
    },
    admin: {
      stats: {
        users: 'المستخدمين',
        requests: 'الطلبات',
        messages: 'الرسائل',
        activeBanners: 'البنرات النشطة',
        systemOk: 'النظام يعمل بكفاءة'
      },
      sidebar: {
        title: 'لوحة المدير',
        groupChat: 'غرفة المشرفين',
        liveSupport: 'الدعم المباشر',
        allRequests: 'كل الطلبات',
        visitors: 'الزوار',
        users: 'المستخدمين',
        banners: 'إدارة البنرات',
        officialMsgs: 'رسائل رسمية',
        manageAdmins: 'إدارة المشرفين',
        clientMsgs: 'رسائل العملاء'
      },
      requests: {
        title: 'إدارة الطلبات الواردة',
        client: 'العميل',
        type: 'نوع المشروع',
        desc: 'الوصف',
        status: 'الحالة',
        actions: 'إجراءات',
        budget: 'الميزانية',
        empty: 'لا توجد طلبات لعرضها',
        statuses: {
          PENDING: 'قيد المراجعة',
          IN_PROGRESS: 'جاري العمل',
          COMPLETED: 'مكتمل',
          REJECTED: 'مرفوض'
        },
        notifications: {
          pending: 'تم استلام طلبكم وهو حالياً قيد الانتظار.',
          inProgress: 'جاري العمل على طلبكم الآن.',
          completed: 'تم الانتهاء من الطلب الخاص بكم بنجاح.',
          rejected: 'تم رفض الطلب الخاص بكم.'
        }
      },
      users: {
        title: 'المستخدمين المسجلين',
        roleAdmin: 'مدير',
        banned: 'محظور',
        ban: 'حظر',
        unban: 'فك حظر',
        delete: 'حذف',
        confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟',
        confirmBan: 'هل أنت متأكد من تغيير حالة الحظر؟'
      },
      visitors: {
        title: 'سجل الزوار',
        desc: 'قائمة بجميع الأجهزة التي قامت بزيارة الموقع.',
        deviceId: 'معرف الجهاز',
        lastVisit: 'آخر زيارة',
        visits: 'عدد الزيارات',
        deviceInfo: 'معلومات الجهاز',
        empty: 'لا يوجد سجل زيارات حتى الآن'
      },
      banners: {
        title: 'إدارة بنرات الإعلانات',
        add: 'إضافة بنر جديد',
        placeholderTitle: 'عنوان البنر',
        upload: 'اضغط لرفع صورة',
        uploading: 'جاري الرفع...',
        publish: 'نشر البنر',
        active: 'نشط',
        inactive: 'غير نشط',
        empty: 'لا توجد بنرات حالياً',
        success: 'تم نشر البنر بنجاح!',
        deleteConfirm: 'حذف هذا البنر؟'
      },
      messages: {
        title: 'رسائل العملاء'
      },
      official: {
        title: 'رسائل رسمية للمستخدمين',
        new: 'إرسال رسالة جديدة للجميع',
        desc: 'هذه الرسالة ستظهر لجميع مستخدمي الموقع في خانة "رسائل رسمية".',
        labelTitle: 'عنوان الرسالة',
        labelBody: 'نص الرسالة',
        btnSend: 'نشر الرسالة الرسمية',
        success: 'تم إرسال الرسالة الرسمية لجميع المستخدمين.'
      },
      admins: {
        title: 'إدارة المشرفين وصلاحيات الوصول',
        defaultSetup: 'الإعداد السريع للطاقم',
        defaultDesc: 'إنشاء حسابات المشرفين الافتراضية بضغطة واحدة.',
        btnCreateDefault: 'إنشاء طاقم الإدارة الافتراضي',
        addCustom: 'إضافة مشرف جديد',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        btnAdd: 'إضافة المشرف',
        currentAdmins: 'قائمة المشرفين الحاليين',
        dangerZone: 'منطقة الخطر',
        dangerDesc: 'الإجراءات في هذا القسم حرجة جداً ولا يمكن التراجع عنها.',
        resetTitle: 'تصفير النظام وحذف كافة البيانات',
        resetDesc: 'سيتم حذف جميع (الطلبات، الرسائل، الإشعارات، المحادثات) بشكل نهائي.',
        btnReset: 'حذف كل البيانات الآن',
        confirmReset1: 'تحذير شديد الخطورة! سيتم حذف كافة البيانات. هل أنت متأكد؟',
        confirmReset2: 'هل أنت متأكد تماماً؟ لا يمكن التراجع.'
      },
      chat: {
        groupTitle: 'غرفة المشرفين',
        groupDesc: 'مساحة خاصة للتواصل بين فريق الإدارة',
        placeholder: 'اكتب رسالة للفريق...',
        you: 'أنت',
        incoming: 'طلبات واردة',
        waiting: 'ينتظر التوصيل...',
        accept: 'قبول المحادثة',
        myChats: 'محادثاتي النشطة',
        noActive: 'لا توجد محادثات نشطة',
        talkingTo: 'محادثة مع',
        endChat: 'إنهاء المحادثة',
        confirmEnd: 'هل أنت متأكد من إنهاء هذه المحادثة؟',
        replyPlaceholder: 'اكتب ردك هنا...'
      }
    },
    auth: {
      loginTitle: 'تسجيل الدخول',
      registerTitle: 'إنشاء حساب جديد',
      loginSub: 'مرحباً بك مجدداً في عالم فليكس',
      registerSub: 'انضم إلينا وابدأ رحلة تصميم مشاريعك',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      btnLogin: 'دخول',
      btnRegister: 'تسجيل',
      haveAccount: 'لديك حساب بالفعل؟ تسجيل الدخول',
      noAccount: 'ليس لديك حساب؟ سجل الآن'
    },
    form: {
      title: 'طلب تصميم جديد',
      loggedInAs: 'مرحباً',
      enterDetails: 'أدخل تفاصيل مشروعك الجديد.',
      guestMsg: 'أدخل تفاصيل مشروعك وسنقوم بالرد عليك في أقرب وقت.',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      projectType: 'نوع المشروع',
      projectDetails: 'تفاصيل المشروع',
      enhanceBtn: 'تحسين الوصف بالذكاء الاصطناعي',
      enhanceTip: 'نصيحة: يمكنك كتابة فكرة بسيطة والضغط على "تحسين الوصف" ليقوم Gemini بصياغتها بشكل احترافي.',
      budget: 'الميزانية المتوقعة (اختياري)',
      cancel: 'إلغاء',
      submit: 'إرسال الطلب',
      placeholderName: 'مثال: محمد أحمد',
      placeholderDesc: 'صف مشروعك هنا... ما هي الفكرة؟ ما هي الألوان المفضلة؟',
      placeholderBudget: 'مثال: 500$ - 1000$'
    },
    dashboard: {
      welcome: 'عضو منذ',
      myRequests: 'طلباتي',
      profile: 'الملف الشخصي',
      requestHistory: 'سجل الطلبات',
      noRequests: 'لا توجد طلبات حتى الآن',
      startProject: 'ابدأ مشروعك الأول معنا اليوم',
      date: 'تاريخ الطلب',
      budget: 'الميزانية',
      editProfile: 'تعديل الملف الشخصي',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      saveChanges: 'حفظ التغييرات',
      successUpdate: 'تم تحديث المعلومات بنجاح',
      errorUpdate: 'فشل تحديث المعلومات',
      status: {
        PENDING: 'قيد المراجعة',
        IN_PROGRESS: 'جاري العمل',
        COMPLETED: 'مكتمل',
        REJECTED: 'مرفوض'
      }
    },
    contact: {
      title: 'تواصل معنا',
      desc: 'نحن هنا للإجابة على استفساراتك وتحويل أفكارك إلى واقع. لا تتردد في الاتصال بنا.',
      callUs: 'اتصل بنا الآن',
      emailUs: 'البريد الإلكتروني',
      hq: 'المقر الرئيسي',
      location: 'القرية الذكية، القاهرة',
      sendMessage: 'أرسل لنا رسالة',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      message: 'الرسالة',
      msgPlaceholder: 'كيف يمكننا مساعدتك؟',
      sendBtn: 'إرسال الرسالة',
      successTitle: 'تم الإرسال بنجاح',
      successDesc: 'سنقوم بالرد عليك في أقرب وقت ممكن.',
      sendAnother: 'إرسال رسالة أخرى'
    },
    messages: {
      inbox: 'صندوق الرسائل',
      subtitle: 'تابع آخر التحديثات والإعلانات الرسمية',
      official: 'الرسائل الرسمية',
      system: 'رسائل النظام',
      noOfficial: 'لا توجد رسائل رسمية حالياً',
      noSystem: 'لا توجد إشعارات نظام سابقة',
      sentBy: 'مرسل من الإدارة',
      new: 'جديد'
    },
    support: {
      title: 'الدعم المباشر',
      loginReq: 'يرجى تسجيل الدخول للوصول إلى خدمة الدعم الفني المباشر.',
      botName: 'المساعد الذكي',
      agentName: 'الدعم الفني المباشر',
      botLabel: 'بوت آلي',
      agentLabel: 'متصل مع ممثل خدمة العملاء',
      sessionClosed: 'تم إنهاء المحادثة',
      closedDesc: 'شكراً لتواصلك معنا. نأمل أن نكون قد أجبنا على جميع استفساراتك.',
      newChat: 'بدء محادثة جديدة',
      placeholder: 'اكتب رسالتك هنا...',
      chooseOption: 'يرجى اختيار أحد الخيارات أعلاه للمتابعة',
      botOptions: {
        pricing: 'أسعار التصميم',
        services: 'خدماتنا',
        human: 'تحدث مع خدمة العملاء'
      },
      botResponses: {
        pricing: 'تختلف الأسعار حسب نوع المشروع. الشعارات تبدأ من 50$، الهوية الكاملة من 200$. يمكنك الاطلاع على التفاصيل في صفحة طلب التصميم.',
        services: 'نقدم خدمات: تصميم الشعارات، الهوية البصرية، واجهات المواقع (UI/UX)، ومنتجات الوكالات الصوتية.',
        humanErr: 'يجب تسجيل الدخول أولاً للتحدث مع ممثل خدمة العملاء.',
        welcome: 'مرحباً بك في فليكس ديزاين! 👋 أنا المساعد الذكي، كيف يمكنني مساعدتك اليوم؟',
        connectMsg: 'برجاء الانتظار سوف يرد عليك احد ممثلي خدمة العملاء الان'
      }
    },
    success: {
      title: 'تم استلام طلبك بنجاح!',
      desc: 'شكراً لاختيارك Flex Design Academy. سيقوم فريقنا بمراجعة تفاصيل مشروعك.',
      track: 'يمكنك تتبع حالة الطلب من لوحة التحكم.',
      newRequest: 'تقديم طلب آخر'
    },
    privacy: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: 1 يناير 2025',
      intro: 'في Flex Design Academy، نولي خصوصيتك أهمية قصوى. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.',
      sections: [
        {
          title: 'جمع المعلومات',
          content: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو طلب خدمة، مثل الاسم، البريد الإلكتروني، وتفاصيل المشروع.'
        },
        {
          title: 'استخدام المعلومات',
          content: 'نستخدم معلوماتك لتقديم الخدمات المطلوبة، وتحسين تجربتك في الموقع، والتواصل معك بشأن تحديثات طلباتك.'
        },
        {
          title: 'حماية البيانات',
          content: 'نحن نطبق إجراءات أمان صارمة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفشاء.'
        },
        {
          title: 'مشاركة المعلومات',
          content: 'نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك البيانات فقط مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل الموقع.'
        },
        {
          title: 'حقوقك',
          content: 'لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو طلب حذفها في أي وقت من خلال التواصل معنا.'
        }
      ]
    },
    footer: {
      desc: 'نصنع المستقبل من خلال تصاميم تتحدى المألوف.',
      links: 'روابط سريعة',
      home: 'الرئيسية',
      portfolio: 'معرض الأعمال',
      services: 'خدماتنا',
      privacy: 'سياسة الخصوصية',
      contact: 'تواصل معنا',
      rights: 'جميع الحقوق محفوظة.',
      madeWith: 'صنع بـ',
      love: 'وإبداع'
    }
  },
  en: {
    nav: {
      home: 'Home',
      contact: 'Contact Us',
      liveSupport: 'Live Support',
      requestDesign: 'Request Design',
      requestNew: 'New Request',
      dashboard: 'Track Requests',
      adminPanel: 'Admin Panel',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      messages: 'Messages & Alerts',
      theme: 'App Theme',
      language: 'Language'
    },
    hero: {
      badge: 'AI-Powered Designs from Another Dimension',
      titleStart: 'Welcome to',
      titleEnd: 'Flex Design Academy',
      description: 'Taking your ideas to a new dimension where art meets technology to create visually enchanting experiences.',
      btnStart: 'Start Journey',
      btnExplore: 'Explore Galaxy',
      btnRequest: 'Request Now',
      servicesTitle: 'Our Creative Services',
      servicesDesc: 'At Flex Design, we don\'t just deliver designs, we craft visual experiences that tell your brand\'s story.',
      srvVoice: 'Voice Agencies & Programs',
      srvVoiceDesc: 'Designing agency logos, administration frames, and badges for all voice chat programs.',
      srvBranding: 'Branding & Logos',
      srvBrandingDesc: 'Creating unique logos and full visual identities that reflect your brand essence.',
      srvUi: 'UI/UX Design',
      srvUiDesc: 'Designing websites and apps combining aesthetics with usability.',
      srvSocial: 'Social Media Designs',
      srvSocialDesc: 'Creating engaging visual content to boost interaction and reach.',
      srvMotion: 'Motion Graphics & Editing',
      srvMotionDesc: 'Transforming static ideas into stunning animated videos.',
      noBanners: 'No active banners currently'
    },
    admin: {
      stats: {
        users: 'Users',
        requests: 'Requests',
        messages: 'Messages',
        activeBanners: 'Active Banners',
        systemOk: 'System Healthy'
      },
      sidebar: {
        title: 'Admin Panel',
        groupChat: 'Admin Room',
        liveSupport: 'Live Support',
        allRequests: 'All Requests',
        visitors: 'Visitors',
        users: 'Users',
        banners: 'Banners',
        officialMsgs: 'Official Msgs',
        manageAdmins: 'Manage Admins',
        clientMsgs: 'Client Msgs'
      },
      requests: {
        title: 'Incoming Requests Management',
        client: 'Client',
        type: 'Project Type',
        desc: 'Description',
        status: 'Status',
        actions: 'Actions',
        budget: 'Budget',
        empty: 'No requests to display',
        statuses: {
          PENDING: 'Pending',
          IN_PROGRESS: 'In Progress',
          COMPLETED: 'Completed',
          REJECTED: 'Rejected'
        },
        notifications: {
          pending: 'Your request has been received and is pending.',
          inProgress: 'Work on your request is now in progress.',
          completed: 'Congratulations! Your request has been completed.',
          rejected: 'Your request has been rejected.'
        }
      },
      users: {
        title: 'Registered Users',
        roleAdmin: 'Admin',
        banned: 'Banned',
        ban: 'Ban',
        unban: 'Unban',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this user?',
        confirmBan: 'Are you sure you want to change ban status?'
      },
      visitors: {
        title: 'Visitors Log',
        desc: 'List of all unique devices that visited the site.',
        deviceId: 'Device ID',
        lastVisit: 'Last Visit',
        visits: 'Visits',
        deviceInfo: 'Device Info',
        empty: 'No visitors recorded yet'
      },
      banners: {
        title: 'Banner Management',
        add: 'Add New Banner',
        placeholderTitle: 'Banner Title',
        upload: 'Click to upload image',
        uploading: 'Uploading...',
        publish: 'Publish Banner',
        active: 'Active',
        inactive: 'Inactive',
        empty: 'No banners currently',
        success: 'Banner published successfully!',
        deleteConfirm: 'Delete this banner?'
      },
      messages: {
        title: 'Client Messages'
      },
      official: {
        title: 'Official Announcements',
        new: 'Send Message to Everyone',
        desc: 'This message will appear in the "Official Messages" inbox for all users.',
        labelTitle: 'Message Title',
        labelBody: 'Message Body',
        btnSend: 'Publish Announcement',
        success: 'Announcement sent to all users.'
      },
      admins: {
        title: 'Manage Admins & Access',
        defaultSetup: 'Quick Staff Setup',
        defaultDesc: 'Create default admin accounts in one click.',
        btnCreateDefault: 'Create Default Admins',
        addCustom: 'Add New Admin',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        btnAdd: 'Add Admin',
        currentAdmins: 'Current Admins',
        dangerZone: 'Danger Zone',
        dangerDesc: 'Actions here are critical and irreversible.',
        resetTitle: 'System Reset & Data Wipe',
        resetDesc: 'All data (requests, messages, chats) will be permanently deleted.',
        btnReset: 'Wipe All Data Now',
        confirmReset1: 'Critical Warning! All data will be wiped. Are you sure?',
        confirmReset2: 'Are you absolutely sure? This cannot be undone.'
      },
      chat: {
        groupTitle: 'Admin Room',
        groupDesc: 'Private space for admin team communication',
        placeholder: 'Type a message to team...',
        you: 'You',
        incoming: 'Incoming Requests',
        waiting: 'Waiting for connection...',
        accept: 'Accept Chat',
        myChats: 'My Active Chats',
        noActive: 'No active chats',
        talkingTo: 'Chatting with',
        endChat: 'End Chat',
        confirmEnd: 'Are you sure you want to end this chat?',
        replyPlaceholder: 'Type your reply...'
      }
    },
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Create New Account',
      loginSub: 'Welcome back to the world of Flex',
      registerSub: 'Join us and start your design journey',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      btnLogin: 'Login',
      btnRegister: 'Register',
      haveAccount: 'Already have an account? Login',
      noAccount: 'Don\'t have an account? Register now'
    },
    form: {
      title: 'New Design Request',
      loggedInAs: 'Welcome',
      enterDetails: 'Enter your new project details.',
      guestMsg: 'Enter project details and we will reply shortly.',
      fullName: 'Full Name',
      email: 'Email Address',
      projectType: 'Project Type',
      projectDetails: 'Project Details',
      enhanceBtn: 'Enhance with AI',
      enhanceTip: 'Tip: Write a simple idea and click "Enhance" to let Gemini professionalize it.',
      budget: 'Expected Budget (Optional)',
      cancel: 'Cancel',
      submit: 'Submit Request',
      placeholderName: 'Ex: John Doe',
      placeholderDesc: 'Describe your project here... What is the idea? Preferred colors?',
      placeholderBudget: 'Ex: $500 - $1000'
    },
    dashboard: {
      welcome: 'Member since',
      myRequests: 'My Requests',
      profile: 'Profile',
      requestHistory: 'Request History',
      noRequests: 'No requests yet',
      startProject: 'Start your first project with us today',
      date: 'Date',
      budget: 'Budget',
      editProfile: 'Edit Profile',
      fullName: 'Full Name',
      email: 'Email',
      saveChanges: 'Save Changes',
      successUpdate: 'Profile updated successfully',
      errorUpdate: 'Failed to update profile',
      status: {
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
        REJECTED: 'Rejected'
      }
    },
    contact: {
      title: 'Contact Us',
      desc: 'We are here to answer your questions and turn your ideas into reality.',
      callUs: 'Call Us Now',
      emailUs: 'Email',
      hq: 'Headquarters',
      location: 'Smart Village, Cairo',
      sendMessage: 'Send us a message',
      name: 'Name',
      phone: 'Phone Number',
      message: 'Message',
      msgPlaceholder: 'How can we help you?',
      sendBtn: 'Send Message',
      successTitle: 'Sent Successfully',
      successDesc: 'We will reply to you as soon as possible.',
      sendAnother: 'Send another message'
    },
    messages: {
      inbox: 'Inbox',
      subtitle: 'Follow latest updates and official announcements',
      official: 'Official Messages',
      system: 'System Messages',
      noOfficial: 'No official messages currently',
      noSystem: 'No system notifications yet',
      sentBy: 'Sent by Admin',
      new: 'New'
    },
    support: {
      title: 'Live Support',
      loginReq: 'Please login to access live support.',
      botName: 'AI Assistant',
      agentName: 'Live Support Agent',
      botLabel: 'Automated Bot',
      agentLabel: 'Connected with Agent',
      sessionClosed: 'Chat Ended',
      closedDesc: 'Thank you for contacting us. We hope we answered all your questions.',
      newChat: 'Start New Chat',
      placeholder: 'Type your message here...',
      chooseOption: 'Please choose an option above to continue',
      botOptions: {
        pricing: 'Design Pricing',
        services: 'Our Services',
        human: 'Talk to Agent'
      },
      botResponses: {
        pricing: 'Prices vary by project type. Logos start from $50, Full Branding from $200. Check the Request Design page for details.',
        services: 'We offer: Logo Design, Visual Identity, UI/UX, and Voice Agency products.',
        humanErr: 'You must login first to talk to a customer service agent.',
        welcome: 'Welcome to Flex Design! 👋 I am the AI Assistant, how can I help you today?',
        connectMsg: 'Please wait, a customer service representative will reply to you now.'
      }
    },
    success: {
      title: 'Request Received Successfully!',
      desc: 'Thank you for choosing Flex Design Academy. Our team will review your project details.',
      track: 'You can track your request status from the Dashboard.',
      newRequest: 'New Request'
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: January 1, 2025',
      intro: 'At Flex Design Academy, we value your privacy. This policy explains how we collect, use, and protect your personal information.',
      sections: [
        {
          title: 'Information Collection',
          content: 'We collect information you provide directly to us when registering or requesting a service, such as name, email, and project details.'
        },
        {
          title: 'Use of Information',
          content: 'We use your information to provide requested services, improve your site experience, and communicate with you about your request updates.'
        },
        {
          title: 'Data Protection',
          content: 'We implement strict security measures to protect your data from unauthorized access, alteration, or disclosure.'
        },
        {
          title: 'Information Sharing',
          content: 'We do not sell or rent your personal information to third parties. We may share data only with trusted service providers who assist us in operating the site.'
        },
        {
          title: 'Your Rights',
          content: 'You have the right to access, correct, or request deletion of your personal information at any time by contacting us.'
        }
      ]
    },
    footer: {
      desc: 'Crafting the future through designs that defy the ordinary.',
      links: 'Quick Links',
      home: 'Home',
      portfolio: 'Portfolio',
      services: 'Services',
      privacy: 'Privacy Policy',
      contact: 'Contact Us',
      rights: 'All rights reserved.',
      madeWith: 'Made with',
      love: 'and creativity'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      contact: 'Contactez-nous',
      liveSupport: 'Support En Direct',
      requestDesign: 'Demander un Design',
      requestNew: 'Nouvelle Demande',
      dashboard: 'Suivre les Demandes',
      adminPanel: 'Panneau Admin',
      login: 'Connexion',
      register: 'S\'inscrire',
      logout: 'Déconnexion',
      messages: 'Messages et Alertes',
      theme: 'Thème',
      language: 'Langue'
    },
    hero: {
      badge: 'Designs IA d\'une Autre Dimension',
      titleStart: 'Bienvenue à',
      titleEnd: 'Flex Design Academy',
      description: 'Nous emmenons vos idées dans une nouvelle dimension où l\'art rencontre la technologie.',
      btnStart: 'Commencer',
      btnExplore: 'Explorer',
      btnRequest: 'Commander',
      servicesTitle: 'Nos Services Créatifs',
      servicesDesc: 'Chez Flex Design, nous créons des expériences visuelles qui racontent l\'histoire de votre marque.',
      srvVoice: 'Agences Vocales',
      srvVoiceDesc: 'Conception de logos d\'agence, cadres d\'administration et badges pour les programmes vocaux.',
      srvBranding: 'Branding & Logos',
      srvBrandingDesc: 'Création de logos uniques et d\'identités visuelles complètes.',
      srvUi: 'Design UI/UX',
      srvUiDesc: 'Conception de sites web et d\'applications alliant esthétique et convivialité.',
      srvSocial: 'Réseaux Sociaux',
      srvSocialDesc: 'Création de contenu visuel engageant pour booster l\'interaction.',
      srvMotion: 'Motion Graphics',
      srvMotionDesc: 'Transformer des idées statiques en vidéos animées époustouflantes.',
      noBanners: 'Aucune bannière active'
    },
    admin: {
      stats: {
        users: 'Utilisateurs',
        requests: 'Demandes',
        messages: 'Messages',
        activeBanners: 'Bannières Actives',
        systemOk: 'Système Sain'
      },
      sidebar: {
        title: 'Panneau Admin',
        groupChat: 'Salle Admin',
        liveSupport: 'Support En Direct',
        allRequests: 'Toutes Demandes',
        visitors: 'Visiteurs',
        users: 'Utilisateurs',
        banners: 'Bannières',
        officialMsgs: 'Msgs Officiels',
        manageAdmins: 'Gérer Admins',
        clientMsgs: 'Msgs Clients'
      },
      requests: {
        title: 'Gestion des Demandes',
        client: 'Client',
        type: 'Type de Projet',
        desc: 'Description',
        status: 'Statut',
        actions: 'Actions',
        budget: 'Budget',
        empty: 'Aucune demande à afficher',
        statuses: {
          PENDING: 'En Attente',
          IN_PROGRESS: 'En Cours',
          COMPLETED: 'Terminé',
          REJECTED: 'Rejeté'
        },
        notifications: {
          pending: 'Votre demande a été reçue et est en attente.',
          inProgress: 'Le travail sur votre demande est maintenant en cours.',
          completed: 'Félicitations ! Votre demande a été complétée.',
          rejected: 'Votre demande a été rejetée.'
        }
      },
      users: {
        title: 'Utilisateurs Inscrits',
        roleAdmin: 'Admin',
        banned: 'Banni',
        ban: 'Bannir',
        unban: 'Débannir',
        delete: 'Supprimer',
        confirmDelete: 'Voulez-vous vraiment supprimer cet utilisateur ?',
        confirmBan: 'Voulez-vous changer le statut de bannissement ?'
      },
      visitors: {
        title: 'Journal des Visiteurs',
        desc: 'Liste de tous les appareils uniques qui ont visité le site.',
        deviceId: 'ID Appareil',
        lastVisit: 'Dernière Visite',
        visits: 'Visites',
        deviceInfo: 'Info Appareil',
        empty: 'Aucun visiteur enregistré'
      },
      banners: {
        title: 'Gestion des Bannières',
        add: 'Ajouter Bannière',
        placeholderTitle: 'Titre de la bannière',
        upload: 'Cliquez pour uploader image',
        uploading: 'Upload en cours...',
        publish: 'Publier Bannière',
        active: 'Actif',
        inactive: 'Inactif',
        empty: 'Aucune bannière actuellement',
        success: 'Bannière publiée avec succès !',
        deleteConfirm: 'Supprimer cette bannière ?'
      },
      messages: {
        title: 'Messages Clients'
      },
      official: {
        title: 'Annonces Officielles',
        new: 'Envoyer Message à Tous',
        desc: 'Ce message apparaîtra dans la boîte "Messages Officiels" de tous les utilisateurs.',
        labelTitle: 'Titre du Message',
        labelBody: 'Corps du Message',
        btnSend: 'Publier Annonce',
        success: 'Annonce envoyée à tous les utilisateurs.'
      },
      admins: {
        title: 'Gérer Admins & Accès',
        defaultSetup: 'Config Rapide Staff',
        defaultDesc: 'Créer comptes admin par défaut en un clic.',
        btnCreateDefault: 'Créer Admins Par Défaut',
        addCustom: 'Ajouter Nouvel Admin',
        name: 'Nom',
        email: 'Email',
        password: 'Mot de passe',
        btnAdd: 'Ajouter Admin',
        currentAdmins: 'Admins Actuels',
        dangerZone: 'Zone de Danger',
        dangerDesc: 'Les actions ici sont critiques et irréversibles.',
        resetTitle: 'Réinitialisation Système',
        resetDesc: 'Toutes les données (demandes, messages, chats) seront supprimées.',
        btnReset: 'Effacer Tout Maintenant',
        confirmReset1: 'Avertissement Critique ! Tout sera effacé. Êtes-vous sûr ?',
        confirmReset2: 'Vraiment sûr ? Ceci est irréversible.'
      },
      chat: {
        groupTitle: 'Salle Admin',
        groupDesc: 'Espace privé pour la communication d\'équipe',
        placeholder: 'Écrire à l\'équipe...',
        you: 'Vous',
        incoming: 'Demandes Entrantes',
        waiting: 'En attente de connexion...',
        accept: 'Accepter Chat',
        myChats: 'Mes Chats Actifs',
        noActive: 'Aucun chat actif',
        talkingTo: 'En discussion avec',
        endChat: 'Terminer Chat',
        confirmEnd: 'Voulez-vous vraiment terminer ce chat ?',
        replyPlaceholder: 'Écrivez votre réponse...'
      }
    },
    auth: {
      loginTitle: 'Connexion',
      registerTitle: 'Créer un Compte',
      loginSub: 'Bienvenue dans le monde de Flex',
      registerSub: 'Rejoignez-nous et commencez votre voyage',
      name: 'Nom',
      email: 'Email',
      password: 'Mot de passe',
      btnLogin: 'Connexion',
      btnRegister: 'S\'inscrire',
      haveAccount: 'Vous avez déjà un compte ? Connexion',
      noAccount: 'Pas de compte ? Inscrivez-vous'
    },
    form: {
      title: 'Nouvelle Demande',
      loggedInAs: 'Bienvenue',
      enterDetails: 'Entrez les détails de votre projet.',
      guestMsg: 'Entrez les détails et nous vous répondrons bientôt.',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      projectType: 'Type de Projet',
      projectDetails: 'Détails du Projet',
      enhanceBtn: 'Améliorer avec IA',
      enhanceTip: 'Conseil : Écrivez une idée simple et cliquez sur "Améliorer" pour que Gemini la professionnalise.',
      budget: 'Budget Prévu (Optionnel)',
      cancel: 'Annuler',
      submit: 'Envoyer la Demande',
      placeholderName: 'Ex: Jean Dupont',
      placeholderDesc: 'Décrivez votre projet ici... Quelle est l\'idée ? Couleurs préférées ?',
      placeholderBudget: 'Ex: 500€ - 1000€'
    },
    dashboard: {
      welcome: 'Membre depuis',
      myRequests: 'Mes Demandes',
      profile: 'Profil',
      requestHistory: 'Historique des Demandes',
      noRequests: 'Pas encore de demandes',
      startProject: 'Commencez votre premier projet avec nous aujourd\'hui',
      date: 'Date',
      budget: 'Budget',
      editProfile: 'Modifier le Profil',
      fullName: 'Nom Complet',
      email: 'Email',
      saveChanges: 'Enregistrer',
      successUpdate: 'Profil mis à jour avec succès',
      errorUpdate: 'Échec de la mise à jour du profil',
      status: {
        PENDING: 'En Attente',
        IN_PROGRESS: 'En Cours',
        COMPLETED: 'Terminé',
        REJECTED: 'Rejeté'
      }
    },
    contact: {
      title: 'Contactez-nous',
      desc: 'Nous sommes là pour répondre à vos questions et concrétiser vos idées.',
      callUs: 'Appelez-nous',
      emailUs: 'Email',
      hq: 'Siège Social',
      location: 'Village Intelligent, Le Caire',
      sendMessage: 'Envoyez-nous un message',
      name: 'Nom',
      phone: 'Téléphone',
      message: 'Message',
      msgPlaceholder: 'Comment pouvons-nous vous aider ?',
      sendBtn: 'Envoyer le Message',
      successTitle: 'Envoyé avec succès',
      successDesc: 'Nous vous répondrons dès que possible.',
      sendAnother: 'Envoyer un autre message'
    },
    messages: {
      inbox: 'Boîte de Réception',
      subtitle: 'Suivez les dernières mises à jour et annonces officielles',
      official: 'Messages Officiels',
      system: 'Messages Système',
      noOfficial: 'Aucun message officiel actuellement',
      noSystem: 'Aucune notification système',
      sentBy: 'Envoyé par Admin',
      new: 'Nouveau'
    },
    support: {
      title: 'Support En Direct',
      loginReq: 'Veuillez vous connecter pour accéder au support.',
      botName: 'Assistant IA',
      agentName: 'Agent Support',
      botLabel: 'Bot Automatisé',
      agentLabel: 'Connecté avec un Agent',
      sessionClosed: 'Chat Terminé',
      closedDesc: 'Merci de nous avoir contactés. Nous espérons avoir répondu à toutes vos questions.',
      newChat: 'Démarrer un Nouveau Chat',
      placeholder: 'Tapez votre message ici...',
      chooseOption: 'Veuillez choisir une option ci-dessus pour continuer',
      botOptions: {
        pricing: 'Tarifs Design',
        services: 'Nos Services',
        human: 'Parler à un Agent'
      },
      botResponses: {
        pricing: 'Les prix varient selon le type. Logos à partir de 50$, Branding complet à partir de 200$. Voir la page de demande.',
        services: 'Nous proposons : Création de Logo, Identité Visuelle, UI/UX et produits pour agences vocales.',
        humanErr: 'Vous devez d\'abord vous connecter pour parler à un agent.',
        welcome: 'Bienvenue chez Flex Design ! 👋 Je suis l\'Assistant IA, comment puis-je vous aider ?',
        connectMsg: 'Veuillez patienter, un représentant du service client va vous répondre maintenant.'
      }
    },
    success: {
      title: 'Demande Reçue avec Succès !',
      desc: 'Merci d\'avoir choisi Flex Design Academy. Notre équipe examinera les détails de votre projet.',
      track: 'Vous pouvez suivre l\'état de votre demande depuis le Tableau de Bord.',
      newRequest: 'Nouvelle Demande'
    },
    privacy: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour : 1er janvier 2025',
      intro: 'Chez Flex Design Academy, nous accordons une importance primordiale à votre confidentialité. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.',
      sections: [
        {
          title: 'Collecte d\'informations',
          content: 'Nous collectons les informations que vous nous fournissez directement lors de l\'inscription ou de la demande d\'un service, telles que le nom, l\'email et les détails du projet.'
        },
        {
          title: 'Utilisation des informations',
          content: 'Nous utilisons vos informations pour fournir les services demandés, améliorer votre expérience sur le site et communiquer avec vous concernant les mises à jour de vos demandes.'
        },
        {
          title: 'Protection des données',
          content: 'Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données contre tout accès non autorisé, modification ou divulgation.'
        },
        {
          title: 'Partage d\'informations',
          content: 'Nous ne vendons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager des données uniquement avec des prestataires de services de confiance qui nous aident à exploiter le site.'
        },
        {
          title: 'Vos droits',
          content: 'Vous avez le droit d\'accéder à vos informations personnelles, de les corriger ou de demander leur suppression à tout moment en nous contactant.'
        }
      ]
    },
    footer: {
      desc: 'Façonner l\'avenir grâce à des designs qui défient l\'ordinaire.',
      links: 'Liens Rapides',
      home: 'Accueil',
      portfolio: 'Portfolio',
      services: 'Services',
      privacy: 'Politique de Confidentialité',
      contact: 'Contactez-nous',
      rights: 'Tous droits réservés.',
      madeWith: 'Fait avec',
      love: 'et créativité'
    }
  }
};