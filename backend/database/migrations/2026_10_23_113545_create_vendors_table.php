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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->string('shop_name');
            $table->string('owner_name');
            $table->string('pan')->unique();
            $table->string('gst')->nullable();
            $table->string('adhar_number', 12)->unique();
            $table->string('bank_acount')->unique();
            $table->string('cancelled_checque')->nullable();
            $table->enum('status', ['Under review', 'Approved', 'Rejected'])->default('Under review');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
