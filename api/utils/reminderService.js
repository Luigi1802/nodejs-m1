const cron = require('node-cron');
const CustomerRequest = require('../models/CustomerRequest');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const { sendEmail } = require('../utils/emailService');

// Planification du cron job toutes les minutes (peut être ajusté selon les besoins)
cron.schedule('*/1 * * * *', async () => {
    console.log('┌ Vérification des réservations...');
    const rentals = await CustomerRequest.findPendingReminders();

    if (rentals.length === 0) {
        console.log('└ Aucune réservation à rappeler.');
        return;
    } else {
        console.log('├ Rappels à envoyer : ', rentals.length);
        for (const rental of rentals) {
            try {
                // Récupération des informations du client et de l'équipement
                const customer = await User.findById(rental.customer);
                if (!customer) {
                    console.log(`└ × : Customer not found`);
                    continue;
                }
                const equipment = await Equipment.findById(rental.equipment);
                if (!equipment) {
                    console.log(`└ × : Equipment not found`);
                    continue;
                }
                
                // Prépation de l'email de rappel
                const mailObject = "Reminder about your reservation";
                const mailBody = `Hello, please remember to return the equipment you reserved.\n
                You reserved the equipment "${equipment.name}" and it must be returned before 
                ${rental.end_date.toLocaleDateString()}.\n\nThank you for your understanding.\n`;

                // Envoi de l'email de rappel
                await sendEmail(
                    customer.email,
                    mailObject,
                    mailBody
                );

                // Marquer le rappel comme envoyé
                rental.reminder_sent = true; 
                await rental.save();

                console.log(`└ ✔`);
            } catch (error) {
                console.log(`└ × : ${error.message}`);
            }
        }
    }
});
