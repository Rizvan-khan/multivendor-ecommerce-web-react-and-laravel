<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
$table->string('slug')->nullable()->unique()->after('shop_name');
            $table->string('logo')->nullable()->after('owner_name');
            $table->string('banner')->nullable()->after('logo');
            $table->text('description')->nullable()->after('banner');

            // Contact & Pickup Address
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable()->after('email');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('pincode', 10)->nullable()->after('state');
            $table->string('country')->default('India')->after('pincode');

            // Bank details extra fields
            $table->string('bank_ifsc')->nullable()->after('bank_acount');
            $table->string('bank_holder_name')->nullable()->after('bank_ifsc');

            $table->text('return_policy')->nullable()->after('cancelled_checque');
            $table->text('shipping_policy')->nullable()->after('return_policy');
            $table->json('business_hours')->nullable()->after('shipping_policy');
            $table->boolean('is_vacation_mode')->default(false)->after('business_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn([
                'slug', 'logo', 'banner', 'description', 'email', 'phone',
                'address', 'city', 'state', 'pincode', 'country',
                'bank_ifsc', 'bank_holder_name',
                'return_policy', 'shipping_policy', 'business_hours', 'is_vacation_mode'
            ]);
        });
    }
};
