import { useAuth } from "../../utils/authUtils";
import { auth } from '../../firebase/config';

const AccountTypeModal = () => {
    const { setUserData, handleAccountSelection } = useAuth();

    const handleCloseModal = async () => {
        // Show confirmation dialog
        const confirmClose = window.confirm(
            'Are you sure you want to cancel the sign-in process? Closing this modal will sign you out.'
        );
    
        if (confirmClose) {
            try {
                // Sign out the user from Firebase
                await auth.signOut();
    
                // Reset user data and close the modal
                setUserData({
                    user: null,
                    loading: false,
                    firstName: '',
                    lastName: '',
                    email: '',
                    isTeacher: false,
                    classrooms: [],
                    quizzes: [],
                    showTypeModal: false
                });

                window.location.href = '/login';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Welcome! Select your account type</h2>
                {/* Close Modal button */}
                <button onClick={handleCloseModal} className="h-5 w-5 text-black">X</button>
            </div>
          <div className="flex justify-between gap-4 mt-6">
            <button 
              onClick={() => handleAccountSelection(false)}
              className="w-1/2 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
            >
              Student
            </button>
            <button 
              onClick={() => handleAccountSelection(true)}
              className="w-1/2 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition-colors"
            >
              Teacher
            </button>
          </div>
        </div>
    );
};

export default AccountTypeModal;