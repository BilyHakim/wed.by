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
        Schema::create('wedding_guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_website_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('phone', 25)->nullable();
            $table->string('group', 80)->nullable();
            $table->string('token', 64)->unique();
            $table->unsignedSmallInteger('pax')->default(2);
            $table->string('attendance')->default('pending');
            $table->unsignedSmallInteger('attendees')->default(0);
            $table->text('message')->nullable();
            $table->boolean('message_approved')->default(false);
            $table->timestampTz('responded_at')->nullable();
            $table->timestampTz('checked_in_at')->nullable();
            $table->timestamps();
            $table->index(['wedding_website_id', 'attendance']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wedding_guests');
    }
};
